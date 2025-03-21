# Inayab Template

## UI (Next.js)
The frontend of the application is built using **Next.js**.

### Setup
1. Run the following command to install dependencies:
   ```sh
   npm install

2. Create a .env.local file
    ```sh
    AUTH_SECRET=<Generate from CLI `openssl rand -base64 32`>
    PROJECT_NAME="TEST PROJECT"
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
3. Run locally
    ```sh
    npm run dev

## API (Laravel)

### Setup
1. Run the following command to install dependencies
    ```sh
    composer install

2. Setup .env file and run
    ```sh
    php artisan key:generate
3. Run migrations
    ```sh
    php artisan migrate:fresh --seed

4. Run locally
    ```sh
    php artisan serve
