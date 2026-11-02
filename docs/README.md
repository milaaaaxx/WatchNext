WatchNext browser demo
======================

This version uses HTML, CSS and JavaScript so it can run on GitHub Pages.
Add movies or series and mark them as watched. Each visitor's list is saved
in their own browser with localStorage. It does not sync across devices or
import the PHP version's database. Clearing browser data removes the list.

The original PHP and MariaDB version lives in ../public/.

Local preview, from the repository root:

    php -S 127.0.0.1:8001 -t docs

Open http://127.0.0.1:8001/ in a browser.

GitHub Pages setup:

1. Push the docs folder to GitHub.
2. Open the repository's Settings > Pages.
3. Select Deploy from a branch, then main and /docs, and save.
4. Wait for GitHub's deployment to finish and use the URL shown there.
