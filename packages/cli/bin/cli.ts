#!/usr/bin/env ts-node

import { program } from 'commander';

import packageJson from '../package.json';
import { buildCommand } from '../src/commands/build';
import { generateCommand } from '../src/commands/generate';
import { newCommand } from '../src/commands/new';
import { startCommand } from '../src/commands/start';

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
