# Web Progressive Application: Twitthero.

It is a continuation of the repository: https://github.com/delafuentej/my-first-wpa.

## Main Features:

    - Service Worker Configuration.
    - Cache Strategy: "Network with Cache Fallback".
    - Manifest.json file
    - Management of the local database IndexedDB through the PouchDB library.
    - Offline Synchronization.
    - Subscriptions & Push Notifications. 

## Note:

There is a small express server ready to run and serve the public folder on the web.

Remember that you must rebuild the node modules with the command

1. Clone the reposory.

```
git clone https://github.com/delafuentej/pwa_twitthero.git
```

2. Create a copy of the file `.env.template` and rename it to `.env`, and modify the environmet variables, in order to complete the subscription process.

```
PORT=

VAPID_KEYS_CONFIG_EMAIL=your_email_address

```

3. Install dependencies:

```
npm install
```

4. Execute the command ```npm run generate-vapid``` to generate the file ' server/vapid.json' with  the ```publicKey``` & ```privateKey```.

5. Launch the app in prod mode:

```
npm start
```

6. Launch the app in prod mode:

```
npm run dev
```
