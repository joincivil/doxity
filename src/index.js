import fs from 'fs';

import {
  DOXITYRC_FILE,
  DEFAULT_TARGET,
  DEFAULT_SRC_DIR,
} from './constants';

import init from './init';
import compile from './compile';

const methods = {
  compile,
  init,
};

function populateArguments(passed) {
  // cruft from minimist
  delete passed._;
  // fallback to defaults
  const defaults = {
    target: DEFAULT_TARGET,
    src: DEFAULT_SRC_DIR,
  };

  // merge with .doxityrc
  let saved = {};
  try {
    saved = JSON.parse(fs.readFileSync(`${process.env.PWD}/${DOXITYRC_FILE}`).toString());
  } catch (e) {
    console.log('.doxityrc not found or unreadable');
  }
  // return merge
  return { ...defaults, ...saved, ...passed };
}
// wire up defaults
const wrappedMethods = {};
Object.keys(methods).forEach((key) => {
  wrappedMethods[key] = (args) => {
    const newArgs = populateArguments(args);
    return methods[key](newArgs);
  };
});

export default wrappedMethods;
