Hi there 👋
### This is my first yarn plugin

### Usage
- Clone this repository
- cd yarn-hello
- set yarn 2 as package manager for this repo: `yarn policies set-version berry` or `yarn set version berry`

> This plugin has a command and a hook
- To use the command
  > Run `yarn hello --u <name to greet>` .
  >Replace `<name to greet>` with any name of your choice .
  >For hint on usage run `yarn hello --help`
- The hook will run after every installation
  > Run `yarn install` to see the hook in action .
  >You'll get a message like: "Everything is installed 🎉"
