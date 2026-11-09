# WatchNext

Too many options, nothing to watch? Keep your movies and series in one place and track what you want to watch next.

## What it does

- Add movies and series to your watchlist.
- Mark titles as watched or unwatched.
- Rate titles from one to five stars.
- Delete titles you no longer want on your list.
- Save your watchlist so it is still there when you return.

## Try it online

Open the WatchNext demo.

The online demo saves your watchlist in your browser. It does not sync between devices, and clearing your browser data will remove it.

## How it is built

The project has two versions:

- The GitHub Pages demo uses HTML, CSS and JavaScript.
- The local version uses PHP and MariaDB.

The versions store their watchlists separately. The TMDB poster and description feature is still planned.

## Run the PHP version locally

You need PHP with pdo_mysql, a running MariaDB or MySQL server, and a watchnext database with the watchlist table.

Configure your local database connection in config/database.php. This private file is excluded from Git.

From the project folder, start the local server:

php -S 127.0.0.1:8000 -t public

Then open http://127.0.0.1:8000 in your browser.

## What I want to build next

I plan to add movie posters and descriptions using the TMDB API, then improve the app as I keep learning PHP, databases and web development.
