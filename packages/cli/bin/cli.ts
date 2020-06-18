#!/usr/bin/env ts-node

import { program } from 'commander';

import packageJson from '../package.json';
import { buildCommand } from '../src/build';
import { generateCommand } from '../src/generate';
import { newCommand } from '../src/new';
import { startCommand } from '../src/start';

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
