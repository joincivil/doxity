import childProcess from 'child_process';
import request from 'request-promise';
import path from 'path';
import targz from 'targz'
import fs from 'fs-extra'

import { clearDirectory } from './helpers';

import { DOXITYRC_FILE, DEFAULT_TARGET } from './constants';

export default function (args) {
 
  const { target } = args;

  const doxityrcFile = `${process.env.PWD}/${DOXITYRC_FILE}`;

  // overwrite doxityrc file
  if (fs.existsSync(doxityrcFile)) { fs.unlinkSync(doxityrcFile); }
  fs.writeFileSync(doxityrcFile, `${JSON.stringify(args, null, 2)}\n`);

  // code here to create doxity folder where the contract JSON is deposited
  const  doxityDir = `${process.env.PWD}/${target}`;
  if (!fs.existsSync(doxityDir)) {
      fs.mkdirSync(doxityDir);
  }

  process.stdout.write('Doxity is initialized! Now run `doxity compile`\n');
  process.exit();

}
