# Release Cli
Simplify your release with command. Automatically bump, commit, tag and push.

## Installation
```
# npm
npm install -g @fycosmos/release-cli

#pnpm
pnpm install -g @fycosmos/release-cli
```
## Usage
```
rele [options]

Bump your version number with prompts, commit changes, tag, and push to Git

options:
  -c, --commit         Commit all changed files to git. Defaults to 'chore: release vx.x.x'
  -t, --tag            Tag the Commit. Defaults to 'vx.x.x'
  -p, --push           Push the Commit.
  -r, --recrusive      Recrusively bump all the packages in monorepo.
```

config file is supported:

release.config.js
```js
import { defineConfig } from './src'

export default defineConfig({
  commit: true,
  tag: false,
  push: true,
})
```

