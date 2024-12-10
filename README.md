# Web Progressive Application: Twitthero.

It is a continuation of the repository: https://github.com/delafuentej/my-first-wpa.

## Main Features:

    - Service Worker Configuration.
    - Cache Strategy: "Network with Cache Fallback".
    - Manifest.json file
    - Management of the local database IndexedDB through the PouchDB library.
    - Offline Synchronization.

## Note:

There is a small express server ready to run and serve the public folder on the web.

Remember that you must rebuild the node modules with the command

1. Clone the reposory.

```
git clone https://github.com/delafuentej/pwa_twitthero.git
```

2. Create a copy of the file `.env.template` and rename it to `.env`, and modify the environmet variables.

3. Install dependencies:

```
npm install
```

4. Launch the app in prod mode:

```
npm start
```

5. Launch the app in prod mode:

```
npm run dev
```
