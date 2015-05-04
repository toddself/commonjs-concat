'use strict';

var fs = require('fs');
var tap = require('tap');
var test = tap.test;
var concat = require('..');
var babelify = require('babelify');
var browserify = require('browserify');
var concatStream = require('concat-stream');

tap.tearDown(function(){
  fs.unlink('./fixtures/out.js');
});

test('no rel', function(t) {
  var results = ["exports.testFile1 = require('./test-file-1.js');",
    "exports.testFile2 = require('./test_file-2.js');",
    "exports.testing = require('./testing.json');",
    "exports.testing1 = require('./more/testing.js');",
    "exports.es6 = require('./es6.js');"
  ];

  concat('./fixtures', {
    relative: false,
    includeFile: '*json'
  }, function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});

test('rel', function(t) {
  var results = ["exports.testFile1 = require('"+__dirname+"/fixtures/test-file-1.js');",
    "exports.testFile2 = require('"+__dirname+"/fixtures/test_file-2.js');",
    "exports.testing = require('"+__dirname+"/fixtures/testing.json');",
    "exports.testing1 = require('"+__dirname+"/fixtures/more/testing.js');",
    "exports.es6 = require('"+__dirname+"/fixtures/es6.js');"
  ];

  concat('./fixtures', {
    relative: true,
    includeFile: '*json'
  }, function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});

test('no json', function(t) {
  var results = ["exports.testFile1 = require('./test-file-1.js');",
    "exports.testFile2 = require('./test_file-2.js');",
    "exports.testing = require('./more/testing.js');",
    "exports.es6 = require('./es6.js');"
  ];

  concat('./fixtures', function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});

test('babelify', function(t) {
  concat('./fixtures', function(err, concated) {
    fs.writeFile('./fixtures/out.js', concated, 'utf8', function(){
      browserify()
        .transform(babelify)
        .require('./fixtures/out.js', {entry: true})
        .bundle()
        .pipe(concatStream(function(bundle){
          t.ok(/exports\[\'default\'\]/.test(bundle.toString()), 'browserify transform');
          t.end();
        }));
    });
  });
});