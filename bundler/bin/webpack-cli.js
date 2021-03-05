#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { webpack } = require('../lib/webpack');

program
  .option('-c, --config <config>', 'Provide path to a webpack configuration file e.g. ./webpack.config.js.')

program.parse(process.argv);

const options = program.opts();

(async () => {
  let opts;
  if (options.config && options.config.length > 0) {
    opts = require(path.resolve(options.config));
  } else {
    const defaultConfigFiles = ['webpack.config', '.webpack/webpack.config', '.webpack/webpackfile']
      .map(filename => path.resolve(filename + '.js'));
    let foundDefaultConfigFile;

    for (const defaultConfigFile of defaultConfigFiles) {
      if (!fs.existsSync(defaultConfigFile)) {
        continue;
      }

      foundDefaultConfigFile = defaultConfigFile;
      break;
    }
    opts = require(foundDefaultConfigFile);
  }

  const isMultiCompiler = Array.isArray(opts);
  const config = isMultiCompiler ? opts : [opts];

  let evaluatedConfig = await Promise.all(
    config.map(async (rawConfig) => {
      if (typeof rawConfig.then === 'function') {
        rawConfig = await rawConfig;
      }

      // `Promise` may return `Function`
      if (typeof rawConfig === 'function') {
        // when config is a function, pass the env from args to the config function
        rawConfig = await rawConfig('env', 'argv');
      }

      return rawConfig;
    }),
  );
  const loadedConfig = isMultiCompiler ? evaluatedConfig : evaluatedConfig[0];
  const isObject = (value) => typeof value === 'object' && value !== null;

  if (!isObject(loadedConfig) && !Array.isArray(loadedConfig)) {
    console.error(`Invalid configuration in '${loadedConfig}'`);
    process.exit(2);
  }
  webpack(loadedConfig);
})()
