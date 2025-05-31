Good question!

* Use **`git remote add origin ...`** when **you are adding a remote for the first time** to your local repo.
* Use **`git remote set-url origin ...`** when you **already have a remote named `origin`** and want to **change its URL**.

---

### Example scenarios:

* **Cloning fresh repo:**

```bash
git clone git@github-office:organisation/repo.git
```

Git sets up `origin` automatically for you.

* **If you already have a repo and want to add a remote:**

```bash
git remote add origin git@github-office:organisation/repo.git
```

(Only if no remote named `origin` exists yet)

* **If your repo already has a remote named `origin` but with the wrong URL, and you want to fix it:**

```bash
git remote set-url origin git@github-office:organisation/repo.git
```

---

**So basically, use one or the other depending on whether the remote exists.**

---

If you want me to check your current remotes for a repo, just tell me!
