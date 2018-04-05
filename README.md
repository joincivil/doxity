# Doxity

* This project is a fork of `@0xproject/doxity` 

## Features

* Generates contract meta data used to generate documentation


## Installation

You can install `@joincivil/doxity` globally or locally in your project.

You'll also need `solc 0.4.X` until solc-js is supported (https://github.com/ethereum/solc-js/issues/70)- http://solidity.readthedocs.io/en/develop/installing-solidity.html - and libssl-dev installed on your machine.

```bash
# globally
npm install -g @joincivil/doxity
# or within project folder
npm install --save-dev @joincivil/doxity
```

## Quickstart

1. Have a project that contains natspecced* `.sol` contracts in a `contracts` directory
1. `doxity init` will create a `/doxity` directory where contract JSON metadata will be saved
1. `doxity compile` will generate contract JSON metadata to `./doxity`

