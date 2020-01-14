## Taskello
A simple task manager where you can create, edit and remove tasks.

## How to use
Clone the repo and use `npm install` to install all required packages.

Duplicate the `.env.example` file and rename it as `.env` then adjust your database name, user and password.
Start your MySQL server and execute `php artisan migrate` to popolate the database.
Start your local server (or use `php artisan serve` if you don't have one) and then you can find Taskello at: 127.0.0.1:8000