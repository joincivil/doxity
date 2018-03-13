import childProcess from 'child_process';
import path from 'path';
import fs from 'fs-extra'

import { DOXITYRC_FILE, DEFAULT_TARGET } from './constants';

export default function (args) {
 
  const { target } = args;

  const ROOT_DIR = process.env.PWD

  const doxityrcFile = `${ROOT_DIR}/${DOXITYRC_FILE}`;

  // overwrite doxityrc file
  
  fs.writeFileSync(doxityrcFile, `${JSON.stringify(args, null, 2)}\n`);

  // code here to create doxity folder where the contract JSON is deposited
  const  doxityDir = `${ROOT_DIR}/${target}`;
  if (!fs.existsSync(doxityDir)) {
      fs.mkdirSync(doxityDir);
  }

  process.stdout.write('Doxity is initialized! Now run `doxity compile`\n');
  process.exit();

}


