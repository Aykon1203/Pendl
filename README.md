# Pendl

A mobile commuter app for Belgian train travelers, featuring a clock widget and real-time NMBS/SNCB train information.

## Features

- **Clock Widget**: Always know the current time
- **iRail Widget**: Real-time train departures and delays from NMBS/SNCB stations
- Built with Vue.js and Capacitor for native Android performance

## Building the App

### Prerequisites

- Node.js and pnpm
- Android Studio (for building APK)

### Setup

1. **Install dependencies**
```bash
   pnpm install
```

2. **Build the web app**
```bash
   pnpm run build
```

3. **Add Android platform** (first time only)
```bash
   pnpm add @capacitor/core @capacitor/cli @capacitor/android @capacitor/status-bar
   pnpm exec cap add android
```

4. **Sync to Android**
```bash
   pnpm exec cap sync android
```

5. **Open in Android Studio**
```bash
   pnpm exec cap open android
```

6. **Build APK**

   In Android Studio:
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in `android/app/build/outputs/apk/debug/app-debug.apk`

## Making Changes

After editing code:
```bash
pnpm run build
pnpm exec cap sync android
```

Then rebuild the APK in Android Studio.

## Data Source

Train data is provided by [iRail](https://irail.be/), a free and open-source API for Belgian railway information.

## Note

This is a mobile-only application designed for Android devices. There is no backend server - all data is fetched directly from public APIs.

Because this project is a Capacitor Android app, a `.env` file is not required. If you do use API keys during local development, keep them in a local, untracked `.env` file and never commit it.

Note: You can change the default "from" and "to" destinations in `frontend/src/components/widgets/IrailWidget.vue` by changing these variables:
```bash
const fromA = 'Sint-Niklaas'
const toA = 'Gent-Sint-Pieters'
```