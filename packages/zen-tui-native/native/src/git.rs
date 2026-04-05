use git2::{Repository, Oid, DiffOptions};
use serde::{Serialize, Deserialize};
use chrono::{TimeZone, Utc};

#[derive(Serialize, Deserialize)]
pub struct CommitRecord {
    pub hash: String,
    pub message: String,
    pub author: String,
    pub date: String,
}

#[derive(Serialize, Deserialize)]
pub struct FileStatus {
    pub path: String,
    pub state: String,
}

#[derive(Serialize, Deserialize)]
pub struct SyncDelta {
    pub ahead: usize,
    pub behind: usize,
}

pub struct NativeGit {
    repo: Repository,
}

impl NativeGit {
    pub fn new(path: &str) -> Result<Self, git2::Error> {
        let repo = Repository::discover(path)?;
        Ok(Self { repo })
    }

    pub fn get_config_user(&self) -> String {
        self.repo.config()
            .and_then(|cfg| cfg.get_string("user.name"))
            .unwrap_or_else(|_| "unknown".to_string())
    }

    pub fn fetch_origin(&self) -> Result<(), git2::Error> {
        let mut remote = self.repo.find_remote("origin")?;
        let _ = remote.fetch(&["main", "master", "dev"], None, None);
        Ok(())
    }

    pub fn get_upstream_delta(&self) -> Result<SyncDelta, git2::Error> {
        let head = self.repo.head()?;
        let local_oid = head.target().ok_or_else(|| git2::Error::from_str("No HEAD OID"))?;
        
        // 🧱 Upstream Resolution: Defaulting to 'origin/main' or 'origin/dev' if not explicitly tracked
        let upstream_names = ["origin/main", "origin/master", "origin/dev", "upstream/main"];
        for name in upstream_names.iter() {
            if let Ok(upstream) = self.repo.revparse_single(name) {
                let upstream_oid = upstream.id();
                let (ahead, behind) = self.repo.graph_ahead_behind(local_oid, upstream_oid)?;
                return Ok(SyncDelta { ahead, behind });
            }
        }
        
        Ok(SyncDelta { ahead: 0, behind: 0 })
    }

    pub fn get_log(&self, limit: usize) -> Result<Vec<CommitRecord>, git2::Error> {
        let mut revwalk = self.repo.revwalk()?;
        revwalk.push_head()?;
        revwalk.set_sorting(git2::Sort::TIME)?;

        let commits: Vec<CommitRecord> = revwalk
            .take(limit)
            .filter_map(|id| {
                let id = id.ok()?;
                let commit = self.repo.find_commit(id).ok()?;
                let author = commit.author();
                let time = commit.time();
                let dt = Utc.timestamp_opt(time.seconds(), 0).unwrap();

                Some(CommitRecord {
                    hash: id.to_string(),
                    message: commit.summary().unwrap_or("").to_string(),
                    author: author.name().unwrap_or("unknown").to_string(),
                    date: dt.format("%Y-%m-%d").to_string(),
                })
            })
            .collect();

        Ok(commits)
    }

    pub fn get_diff(&self, hash: &str) -> Result<String, git2::Error> {
        let oid = Oid::from_str(hash)?;
        let commit = self.repo.find_commit(oid)?;
        let tree = commit.tree()?;
        
        let parent_tree = if commit.parent_count() > 0 {
            Some(commit.parent(0)?.tree()?)
        } else {
            None
        };

        let mut diff_opts = DiffOptions::new();
        let diff = self.repo.diff_tree_to_tree(
            parent_tree.as_ref(),
            Some(&tree),
            Some(&mut diff_opts)
        )?;

        let mut diff_text = String::new();
        diff.print(git2::DiffFormat::Patch, |_delta, _hunk, line| {
            let origin = line.origin();
            if origin == '+' || origin == '-' || origin == ' ' {
                diff_text.push(origin);
            }
            diff_text.push_str(std::str::from_utf8(line.content()).unwrap_or(""));
            true
        })?;

        Ok(diff_text)
    }

    pub fn stage_file(&self, path: &str) -> Result<(), git2::Error> {
        let mut index = self.repo.index()?;
        index.add_path(std::path::Path::new(path))?;
        index.write()?;
        Ok(())
    }

    pub fn unstage_file(&self, path: &str) -> Result<(), git2::Error> {
        let head = self.repo.head()?.peel_to_commit()?;
        let tree = head.tree()?;
        self.repo.reset_default(Some(tree.as_object()), Some(path))?;
        Ok(())
    }

    pub fn get_status(&self) -> Result<Vec<FileStatus>, git2::Error> {
        let mut status_opts = git2::StatusOptions::new();
        status_opts.include_untracked(true);
        let statuses = self.repo.statuses(Some(&mut status_opts))?;
        
        let mut files = Vec::new();
        for entry in statuses.iter() {
            let path = entry.path().unwrap_or("unknown").to_string();
            let status = entry.status();
            
            let state = if status.is_index_new() || status.is_index_modified() || status.is_index_deleted() || status.is_index_typechange() {
                "staged"
            } else {
                "modified"
            };
            
            files.push(FileStatus { path, state: state.to_string() });
        }
            
        Ok(files)
    }

    pub fn commit(&self, message: &str) -> Result<(), git2::Error> {
        let mut index = self.repo.index()?;
        let tree_id = index.write_tree()?;
        let tree = self.repo.find_tree(tree_id)?;
        let signature = self.repo.signature()?;
        let head_ref = self.repo.head()?;
        let head_commit = head_ref.peel_to_commit()?;
        
        self.repo.commit(
            Some("HEAD"),
            &signature,
            &signature,
            message,
            &tree,
            &[&head_commit]
        )?;
        
        Ok(())
    }

    pub fn get_branches(&self) -> Result<Vec<String>, git2::Error> {
        let branches = self.repo.branches(None)?;
        let mut names = Vec::new();
        for branch in branches {
            let (b, _t) = branch?;
            if let Some(name) = b.name()? {
                names.push(name.to_string());
            }
        }
        Ok(names)
    }
}
