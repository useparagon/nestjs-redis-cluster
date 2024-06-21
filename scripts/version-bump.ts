#!/usr/bin/env ts-node

/* eslint-disable no-console */
import fs from 'fs';
import * as glob from 'glob';
import path from 'path';

if (process.argv.length < 3) {
  console.error(`Usage:\n\n\t${path.basename(__filename)} <version>`);
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
    fs.writeFileSync(
      location,
      JSON.stringify(
        {
          ...JSON.parse(fs.readFileSync(location, { encoding: 'utf-8' })),
          version,
        },
        null,
        2,
      ) + '\n',
    );
  });
