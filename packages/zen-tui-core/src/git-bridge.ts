import { execSync, spawn } from 'child_process';

/**
 * Sovereign Git CLI Bridge
 * 
 * Provides high-performance, asynchronous access to Git repository data.
 */

export interface FileItem {
  name: string;
  icon: string;
  indent: number;
  isDir?: boolean;
  status?: 'M' | 'A' | 'D' | 'R' | 'U' | '??';
}

export interface CommitItem {
  hash: string;
  parents: string[];
  track: number;   // Visual column (0, 1, 2...)
  branchName: string;
  msg: string;
  time: string;
  author: string;
  date: string;
  isHead?: boolean;
  isMerge?: boolean;
}

export const getGitStatus = (): FileItem[] => {
  try {
    const output = execSync('git status --short --porcelain', { encoding: 'utf-8' });
    const lines = output.split('\n').filter(Boolean);
    const files: FileItem[] = [];

    // Simple flat list for now, focusing on modified files
    for (const line of lines) {
      const status = line.slice(0, 2).trim() as FileItem['status'];
      const name = line.slice(3).trim();
      files.push({
        name,
        icon: '○',
        indent: 1,
        status
      });
    }

    // Add a mock 'src' folder if empty or for better structure
    if (files.length === 0) {
      files.push({ name: ' (No changes) ', icon: '●', indent: 0 });
    }

    return files;
  } catch (e) {
    return [{ name: 'Error: Not a git repo', icon: '!', indent: 0 }];
  }
};

const parseLogLines = (buffer: string): CommitItem[] => {
  const lines = buffer.split('\n').filter(Boolean);
  const commits: CommitItem[] = [];
  
  for (const line of lines) {
    const parts = line.split('::');
    if (parts.length < 7) continue;
    
    // Parts[0] = "* a1b2c3" (example)
    const graphPart = parts[0];
    const hash = graphPart.trim().split(' ').pop() || "";
    const parents = parts[1].trim().split(' ').filter(Boolean);
    const refs = parts[2].trim();
    const msg = parts[3].trim();
    const author = parts[4].trim();
    const date = parts[5].trim();
    const time = parts[6].trim();

    // Extract track from graph prefix
    const starIndex = graphPart.indexOf('*');
    const track = starIndex >= 0 ? Math.floor(starIndex / 2) : 0;
    
    const isHead = refs.includes('HEAD');
    const branchName = refs.replace(/[()]/g, '').split(',')[0] || 'main';

    if (hash) {
      commits.push({
        hash,
        parents,
        track,
        branchName,
        msg,
        time, 
        author,
        date,
        isHead
      });
    }
  }
  return commits;
};

export const getGitLogSync = (count: number = 30): CommitItem[] => {
  try {
    const format = '%h::%p::%d::%s::%an::%ad::%cr';
    const output = execSync(`git log -${count} --pretty=format:${format} --graph --color=never`, { encoding: 'utf-8' });
    return parseLogLines(output);
  } catch (e) {
    return [];
  }
};

export const getGitLog = (count: number = 30): Promise<CommitItem[]> => {
  return new Promise((resolve) => {
    const format = '%h::%p::%d::%s::%an::%ad::%cr';
    const git = spawn('git', ['log', `-${count}`, `--pretty=format:${format}`, '--graph', '--color=never']);
    
    let buffer = '';
    git.stdout.on('data', (data) => buffer += data.toString());
    git.on('close', () => resolve(parseLogLines(buffer)));
    git.on('error', () => resolve([]));
  });
};

export const getCommitDiff = (hash: string): Promise<string[]> => {
    return new Promise((resolve) => {
        const git = spawn('git', ['show', hash, '--pretty=format:', '--unified=3']);
        let buffer = '';
        git.stdout.on('data', (data) => buffer += data.toString());
        git.on('close', () => {
            resolve(buffer.split('\n'));
        });
    });
};
