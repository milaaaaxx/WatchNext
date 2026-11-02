# WatchNext

Too many options, nothing to watch.

WatchNext is a web app I’m building with PHP and MySQL to organize movies and series I want to watch. I’m making it to learn how forms, databases and websites work together.

The project is still in progress, and I’ll continue developing it in week 3.

## What it does

- Add movies and series to a watchlist.
- Display saved titles.
- Mark titles as watched.
- Keep watched status after refreshing.
- Show everything in a simple purple layout.

## Two versions

The PHP version stores the watchlist in a database. I use MariaDB locally and connect to it through PHP’s PDO MySQL driver.

The GitHub Pages version uses HTML, CSS and JavaScript. It saves each visitor’s list in their browser using localStorage. Lists do not sync between devices, and clearing browser data removes them.

The two versions store their data separately.

## Project structure

WatchNext/
├── public/
│   ├── index.php
│   └── style.css
├── config/
│   └── database.php
├── docs/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
└── README.md

The config/database.php file contains local database credentials and is excluded from Git.

## Run the browser version

Clone the repository:

git clone https://github.com/milaaaaxx/WatchNext.git
cd WatchNext

With PHP installed, start a local server:

php -S 127.0.0.1:8001 -t docs

Open http://127.0.0.1:8001 in your browser. This version does not need a database.

## Run the PHP version

This version requires PHP with pdo_mysql, a running MySQL or MariaDB server, and a database connection configured in config/database.php.

The database needs a watchlist table with these columns:

CREATE TABLE watchlist (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('movie', 'series') NOT NULL,
    watched BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

The connection file must create a PDO connection named $pdo.

Once the database is configured, run:

php -S 127.0.0.1:8000 -t public

Open http://127.0.0.1:8000 in your browser. This version currently uses one shared watchlist and does not have user accounts.

## Planned for week 3

I want to add ratings, preferences and a random suggestion feature to help me decide what to watch next. I’ll also keep improving the design and fixing bugs as I learn.
