// Copyright (c) 2017, The Linux Foundation. All rights reserved.
// SPDX-License-Identifier: MIT

const glob = require('glob');
const yaml = require('js-yaml');
const fs = require('fs');
const {log} = require('console');

const ERROR = 1;
const isCLI = require.main === module;
const colors = {
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m'
};

// @todo only load new/changed yaml - use git diff
function getYamlFilePaths() {
  return glob.sync('{**/*.yaml,**/*.yml}').filter(path => fs.statSync(path).isFile());
}

function failure(error = 'Error') {
  log(colors.red, `${error}`);
  process.exitCode = ERROR;
  return ERROR;
}

function loadYamlFile(path) {
  try {
    let data = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    return {data, path};
  } catch (error) {
    return failure(`Invalid yaml file: ${path}\n`);
  }
}

function logYamlDoc({data, path}) {
  log(colors.cyan, path);
  yaml.safeDump(data).split('\n').forEach(line => log(colors.green, line));
}

function run() {
  let paths = getYamlFilePaths();
  if (!paths.length) {
    return failure('0 yaml files');
  }

  let docs = paths.map(loadYamlFile).filter(x => x !== ERROR);
  if (docs.length) {
    log(colors.yellow, 'Valid yaml file(s):');
  }
  docs.forEach(logYamlDoc);
}

if (isCLI) {
  run();
}
