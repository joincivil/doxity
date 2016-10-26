import fs from 'fs';
import childProcess from 'child_process';

import { DEFAULT_TARGET, DEFAULT_PUBLISH_DIR } from './constants';
import { clearDirectory } from './helpers';

export default function ({ target = DEFAULT_TARGET, out = DEFAULT_PUBLISH_DIR } = {}) {
  // TODO check folder exists...
  const cwd = `${process.env.PWD}/${target}`;
  const outputFolder = `${cwd}/public`;
  const destFolder = `${process.env.PWD}/${out}`;
  clearDirectory(destFolder).then(() => {
    const runDev = childProcess.spawn('npm', ['run', 'build'], { cwd });
    runDev.stdout.pipe(process.stdout);
    runDev.stderr.pipe(process.stderr);
    runDev.on('close', () => {
      fs.renameSync(outputFolder, destFolder);
      process.stdout.write(`Published Documentaiton to ${destFolder}\n`);
      process.exit();
    });
  });
}
