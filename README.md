# FocusFlow Planner

A productivity-focused to-do planner with category-based tasks, recurring reminders, local storage, an export/import backup flow, and a Pomodoro timer.

## Local run

Open `index.html` directly in a browser, or serve it locally:

```bash
python -m http.server 8000
```

Then open: http://localhost:8000/

## Deploy to Render

1. Push the project to GitHub.
2. Log in to Render.
3. Click New + Static Site.
4. Connect the GitHub repository.
5. Use the root folder as the deploy directory.
6. Deploy the site.

## GitHub push commands

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

If GitHub CLI is available:

```bash
gh auth login
gh repo create focusflow-planner --public --source=. --remote=origin --push
```

## Notes

- Data is stored in browser localStorage.
- Export/import is available from the app UI for backup.
- Browser notifications require permission from the browser.
