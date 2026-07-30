# Setup Instructions

## 1. Create the special repository
GitHub shows a profile README only from a repo with the **exact same name as your username**.

1. Go to https://github.com/new
2. Repository name: `fang1177`
3. Visibility: **Public** (required)
4. Check "Add a README file", then create it.

## 2. Add these files
Upload/commit these 3 files into that repo, preserving folder structure:

```
fang1177/
├── README.md
├── scripts/
│   └── update-projects.js
└── .github/
    └── workflows/
        └── update-readme.yml
```

Easiest way (from your computer, with git installed):
```bash
git clone https://github.com/fang1177/fang1177.git
cd fang1177
# copy README.md, scripts/, .github/ into this folder
git add .
git commit -m "Set up dynamic profile README"
git push
```

## 3. Enable Actions permissions
1. Go to your repo → **Settings → Actions → General**
2. Under "Workflow permissions", select **"Read and write permissions"**
3. Save

This lets the workflow commit the auto-updated project list back to the repo.

## 4. Trigger it once manually (optional, to test immediately)
Repo → **Actions** tab → "Update Profile README" → **Run workflow**.

After that, it runs automatically:
- Every time you push to this repo
- Once a day on a schedule (so it also picks up new repos/updates you made anywhere else in your account)

## 5. Personalize
- Replace the "Reach me" line in `README.md` with your real email/LinkedIn/portfolio.
- Edit the "Featured Projects" table any time — it's manual and safe from being overwritten.
- The "All Repositories" section between `<!--START_AUTO_PROJECTS-->` and `<!--END_AUTO_PROJECTS-->` is fully automatic — don't hand-edit it, your edits will be overwritten on the next run.

## 6. Optional next steps
- Add a `LICENSE` and topics to each project repo — improves how they look when featured.
- Add a short description + tags to each of your 5 existing repos (some currently show no description in the table).
- Want me to also generate individual polished READMEs for `smart-ai-hospital`, `VarX`, etc.? Just ask.
