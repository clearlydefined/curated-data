// Copyright (c) 2017, The Linux Foundation. All rights reserved.
// SPDX-License-Identifier: MIT

const glob = require('glob');
const yaml = require('js-yaml');
const fs = require('fs');
const {log} = require('console');
const ERROR = 1;
const isCLI = require.main === module;

// @todo only load new/changed yaml - use git diff
function getYamlFilePaths() {
  return glob.sync('{**/*.yaml,**/*.yml}');
}

function failure(error = 'Error') {
  log(`${error}`);
  process.exitCode = ERROR;
  return ERROR;
}

function loadYamlFile(path) {
  try {
    let data = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    return {data, path};
  } catch (error) {
    return failure(`> Invalid yaml file: ${path}\n`);
  }
}

function logYamlDoc({data, path}) {
  log(path);
  log(data);
}

function run() {
  let paths = getYamlFilePaths();
  if (!paths.length) {
    return failure('> 0 yaml files');
  }

  let docs = paths.map(loadYamlFile).filter(x => x !== ERROR);
  log('> Valid yaml file(s):\n');
  docs.forEach(logYamlDoc);
}

if (isCLI) {
  run();
}
