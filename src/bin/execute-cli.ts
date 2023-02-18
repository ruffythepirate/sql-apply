#!/usr/bin/env node

import {parse} from 'path';
import yargs from 'yargs';
import {parseCliArgs, withDefaultOptions} from './CliOptions';
import {performCliMigration} from './perform-cli-migration';

console.log('Running migrations...');
console.log(process.argv);

const args = yargs(process.argv.slice(2))
  .command('migrate', 'Applies migration scripts to a database')
  .option('migrationsDir', {
    alias: 'm',
    description: 'The directory containing the migration scripts',
    type: 'string',
    demandOption: true,
  })
  .option('host', {
    alias: 'h',
    description: 'The host to connect to',
    type: 'string',
    default: 'localhost',
  })
  .option('port', {
    alias: 'p',
    description: 'The port to connect to',
    type: 'number',
    default: 5432,
  })
  .option('user', {
    alias: 'u',
    description: 'The user to connect as',
    type: 'string',
    default: 'postgres',
  })
  .option('password', {
    alias: 'P',
    description: 'The password to connect with',
    type: 'string',
    default: 'postgres',
  })
  .option('database', {
    alias: 'd',
    description: 'The database to connect to',
    type: 'string',
    default: 'postgres',
  })
  .argv;
console.log('Parsed args:', args);

let cliOptions = parseCliArgs(args);
cliOptions = withDefaultOptions(cliOptions);

console.log('Running migrations with options:', cliOptions);
performCliMigration(cliOptions);


  





