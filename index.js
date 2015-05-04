'use strict';

var path = require('path');
var util = require('util');
var xtend = require('xtend');
var readdirp = require('readdirp')
var camelCase = require('camel-case');

var defaults = {
  fileFilter: ['*.js'],
  directoryFilter: ['!node_modules']
};

function unique(fn, symbols, itr) {
  itr = itr || '';
  var test = util.format('%s%s', fn, itr);
  if (symbols[test]) {
    if (typeof itr === 'string') {
      itr = 0;
    }
    return unique(fn, symbols, ++itr);
  }
  symbols[test] = true;
  return test;
}

function strip(fn, exts) {
  var ext = exts.pop();
  if (ext) {
    return strip(path.basename(fn, ext), exts);
  }
  return fn;
}

function makeFilter(filter) {
  return filter.map(function(part) {
    return ['.', part.replace(/\*/, '').replace(/\./, '')].join('');
  });
};

module.exports = function(baseDir, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var output = [];
  var relative = opts.relative;
  var fileFilter = defaults.fileFilter.concat(opts.includeFile || []);
  var directoryFilter = defaults.directoryFilter.concat(opts.ignoreDir || []);
  var symbols = {};

  var readOpts = {
    fileFilter: fileFilter,
    directoryFilter: directoryFilter,
    entryType: 'files',
    root: baseDir
  };

  readdirp(readOpts)
    .on('data', function(entry) {
      var name = unique(strip(entry.name, makeFilter(fileFilter)), symbols);
      var location = relative ? path.resolve(baseDir, entry.path) : util.format('./%s', entry.path);
      output.push(util.format('exports.%s = require(\'%s\');', camelCase(name), location));
    })
    .on('error', function(err) {
      cb(err);
    })
    .on('end', function() {
      cb(null, output.join('\n'))
    });
};
