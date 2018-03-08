/* eslint-disable global-require */

import fs from 'fs';
import glob from 'glob';
import toml from 'toml';
import tomlify from 'tomlify-j0.4';
import solc from './solc';
import parseAbi from './parse-abi';

function compile({ contracts, output }) {

  process.stdout.write(`Generating output for ${Object.keys(contracts).length} contracts...\n`);
  Object.keys(contracts).forEach((contractName) => {

    const contract = contracts[contractName];
    const { fileName } = contract;
    const { bin, opcodes, abi, devdoc } = contract;
    const { author, title } = devdoc;

    const data = {
      author,
      title,
      fileName: fileName.replace(process.env.PWD, ''),
      name: contractName,
      abi: abi,
      bin: bin,
      opcodes: opcodes,
      source: fs.readFileSync(fileName).toString(),
      abiDocs: parseAbi(contract, fs.readFileSync(fileName).toString()),
    };
    return fs.writeFileSync(`${output}/${contractName}.json`, `${JSON.stringify(data)}\n`);
  });

  process.stdout.write('  done!\n');
}

export default function (opts) {
  const output = `${process.env.PWD}/${opts.target}`;

  if (!fs.existsSync(output)) { throw new Error(`Output directory ${output} not found, are you in the right directory?`); }
  // clear out the output folder (remove all json files)
  glob.sync(`${output}/*.json`).forEach(file => fs.unlinkSync(file));
  // get the natspec
  return solc(opts.src).then(({ contracts }) => {
    compile({ ...opts, output, contracts });
  });
}
