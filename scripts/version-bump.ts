#!/usr/bin/env ts-node

/* eslint-disable no-console */
import { writeFileSync, readFileSync } from 'fs';
import * as glob from 'glob';
import { basename } from 'path';

if (process.argv.length < 3) {
  console.error(`Usage:\n\n\t${basename(__filename)} <version>`);
  process.exit(1);
}

const version: string = process.argv[2];

console.log(`👊 bumping to: ${version}`);
console.log('-'.repeat(20));

glob
  .sync('**/package.json', {
    ignore: ['**/node_modules/**', '**/examples/**'],
  })
  .forEach((location: string) => {
    console.log(`🤜 ${location}`);
    writeFileSync(
      location,
      JSON.stringify(
        {
          ...JSON.parse(readFileSync(location, { encoding: 'utf-8' })),
          version,
        },
        null,
        2,
      ) + '\n',
    );
  });
