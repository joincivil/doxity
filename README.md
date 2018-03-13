# Doxity

## Features

* Generates contract meta data used to generate documentation


## Installation

You can install `@0xproject/doxity` globally or locally in your project.

You'll also need `solc 0.4.X` ([native](http://solidity.readthedocs.io/en/develop/installing-solidity.html#binary-packages) until [solc-js is supported](https://github.com/ethereum/solc-js/issues/70)) and libssl-dev installed on your machine.

```bash
# globally
npm install -g @0xproject/doxity
# or within project folder
npm install --save-dev @0xproject/doxity
```

## Quickstart

1. Have a project that contains natspecced* `.sol` contracts in a `contracts` directory, a `package.json` and `README.md`.
1. `doxity init` will create a `/doxity directory` where contract JSON metadata will be saved
1. `doxity compile` will generate contract JSON metadata to `./doxity`

