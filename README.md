# Own personal web

[Go to the webpage...](https://melchor9000.me)

| `master` | `dev` |
|----------|-------|
| ![master Build Status](https://jenkins.majorcadevs.com/buildStatus/icon?job=melchor9000-personal-page%2Fmaster) | ![dev Build Status](https://jenkins.majorcadevs.com/buildStatus/icon?job=melchor9000-personal-page%2Fdev) |

The web is deployed in Firebase, the source code of it can be found inside the `web` folder. There are some Firebase Functions that helps the web work, those can be found inside `functions`.

To develop in local you need node 10.x and `yarn`. This repo uses yarn workspaces. Useful commands:

- In root:
    - `yarn run audit`: checks if there are any packages with security issues
    - `yarn build`: builds functions and web
    - `yarn lint`: lints functions and web
- In `functions`:
    - `yarn start`: starts a local Firebase Function emulator
    - `yarn watch`: transpiles files when a change is found
- In `web`:
    - `yarn start`: starts a local development server
