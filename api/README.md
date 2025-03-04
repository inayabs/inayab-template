## API (Laravel)

### Setup

1. Run the following command to install dependencies

    ```sh
    composer install

    ```

2. Setup .env file and run
    ```sh
    php artisan key:generate
    ```
3. Run migrations

    ```sh
    php artisan migrate:fresh --seed

    ```

4. Run locally
    ```sh
    php artisan serve
    ```
