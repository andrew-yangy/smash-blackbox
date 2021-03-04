#!/usr/bin/env node

const { program } = require('commander');

program
  .option('-c, --config <config>', 'Provide path to a webpack configuration file e.g. ./webpack.config.js.')

program.parse(process.argv);

const options = program.opts();

(async () => {
})()
