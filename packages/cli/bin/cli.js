#!/usr/bin/env node

require('dotenv').config();

const { program } = require('commander');

const packageJson = require('../package.json');
const { buildCommand } = require('../lib/commands/build');
const { generateCommand } = require('../lib/commands/generate');
const { newCommand } = require('../lib/commands/new');
const { startCommand } = require('../lib/commands/start');

program
  .version(packageJson.version)
  .name('tok')
  .usage('<command> [options]')
  .addHelpCommand(false)
  .addCommand(newCommand)
  .addCommand(startCommand)
  .addCommand(buildCommand)
  .addCommand(generateCommand)
  .parse(process.argv);
