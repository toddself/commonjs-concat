#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var concat = require('./');

var opts = {
  boolean: 'relative',
  default: {
    relative: true
  },
  alias: {
    h: 'help',
    v: 'version',
    o: 'output',
    r: 'relative',
    d: 'ignoreDir',
    f: 'includeFile'
  }
};

var args = minimist(process.argv.slice(2), opts);

if (args.help) {
  return fs.createReadStream('./usage.txt').pipe(process.stdout);
}

if (args.version) {
  return console.log('version', require('./package').version);
}

if (args._.length === 0) {
  console.log('You must specify a source path');
  process.exit(1);
}

var basePath = path.resolve('/', path.join(__dirname, args._[0]));

function makeFilter(term) {
  return ['!', term].join('');
}

var opts = {
  relative: args.relative,
  ignoreDir: args.ignoreDir && args.ignoreDir.split(',').map(makeFilter),
  includeFile: args.includeFile && args.includeFile.split(',')
};

fs.access(basePath, fs.R_OK, function(err) {
  if (err) {
    process.stderr.write(err.message);
    process.exit(1);
  }

  concat(basePath, opts, function(err, data) {
    if (err) {
      process.stderr.write(err);
      process.exit(1);
    }

    if (args.output) {
      fs.writeFile(args.output, data, 'utf8');
    } else {
      process.stdout.write(data);
    }
  });
});
