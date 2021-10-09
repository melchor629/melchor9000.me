# Own personal web

[Go to the webpage...](https://melchor9000.me)

[![CD](https://github.com/melchor629/melchor9000.me/actions/workflows/cd.yml/badge.svg?branch=master&event=push)](https://github.com/melchor629/melchor9000.me/actions/workflows/cd.yml) [![CI](https://github.com/melchor629/melchor9000.me/actions/workflows/ci.yml/badge.svg?branch=dev&event=push)](https://github.com/melchor629/melchor9000.me/actions/workflows/ci.yml)

The web is deployed in Firebase, the source code of it can be found inside the `web` folder. There are some Firebase Functions that helps the web work, those can be found inside `functions`.

To develop in local you need node 14.x and `npm` v7 or higher. This repo uses npm workspaces. Useful commands:

- In root:
    - `npm run audit`: checks if there are any packages with security issues
    - `npm build`: builds functions and web
    - `npm lint`: lints functions and web
- For `functions`:
    - `npm start -w functions`: starts a local Firebase Function emulator
    - `npm run watch -w functions`: transpiles files when a change is found
- For `web`:
    - `npm start -w web`: starts a local development server
