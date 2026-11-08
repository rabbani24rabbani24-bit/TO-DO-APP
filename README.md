# FocusFlow Planner

A productivity-focused planner with category-based tasks, recurring reminders, local storage, an export/import backup flow, a Pomodoro timer, and an integrated bodybuilding tracker.

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
- Fitness logs are stored locally in the same browser and included in planner JSON backups. Fitness analytics can also be exported as CSV.
- Progress photos are private to the current browser/device; JSON backups include them.
- Browser notifications require permission from the browser.
- Pomodoro alert mode can be set to alarm, vibration, or both. When a session ends, the completion dialog repeats the selected alert until Finish is pressed. Sound requires browser audio permission after a user interaction; vibration depends on device/browser support. Keep the app open for timer and reminder alerts.
- Challenge streaks start only after choosing a duration, planner or fitness category, name, and reason. They count dated activity in that category, reset after a missed day, and keep ended/completed challenges in history.
- Deleted planner tasks and planner categories follow the existing 15-day retention. Deleted fitness habits and custom categories remain in Recently Deleted until restored or permanently removed; restoring one also restores its custom log entries.
- Feedback opens an email draft to rabbanisk162002@gmail.com. The user must have an email app configured and send the message; the static app does not send email directly.
- Fitness calorie and macro estimates are starting points, not medical advice; adjust them based on sustained progress.
