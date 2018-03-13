#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import * as Doxity from '../index';

const args = minimist(process.argv.slice(2));

// get json version

if (!args._[0]) {
  const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json')).toString());
  console.log(`
Doxity v${version}

Commands:

init       Initialize your project for use with doxity
compile    Compile solidity contracts to generate docs data

Parameters:

--src      Folder that contains the contracts you want to compile
--target   Folder in project to save contract metadata JSON file

  `);
  process.exit();
} else {
  Doxity.default[args._[0]](args);
}
