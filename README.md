# Widget Dashboard

This repository contains a small dashboard application with a Vue frontend and a NestJS backend that fetches weather data from the OpenWeather API.

## Setup

1. Backend

   - Copy the example env file and add your API key locally (do NOT commit the real `.env`):

     ```bash
     cd backend
     cp .env.example .env
     # edit .env and set OPENWEATHER_API_KEY
     ```

   - Install and run the backend:

     ```bash
     pnpm install
     pnpm start:dev
     ```

   The backend listens on port `3000` by default and the frontend dev server (Vite) is configured to call it on `http://localhost:3000`.

2. Frontend

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

## Security note

Never commit secrets (API keys, passwords) to the repository. Use `.env` for local development and ensure `.gitignore` contains the `.env` entry. If a secret accidentally got pushed to the remote, rotate/regenerate the secret immediately.

## Restoring deleted files

If you accidentally reverted or removed files, this repository contains a recovery commit which attempted to restore the missing backend and frontend files. If anything else is missing, open an issue or contact the maintainer.
