'use strict';

var test = require('tap').test;
var concat = require('..');

test('no rel', function(t) {
  var results = ["exports.testFile1 = require('./test-file-1.js');",
    "exports.testFile2 = require('./test_file-2.js');",
    "exports.testing = require('./testing.json');",
    "exports.testing1 = require('./more/testing.js');",
  ];

  concat('./fixtures', {
    relative: false,
    fileFilter: '*json'
  }, function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});

test('rel', function(t) {
  var results = ["exports.testFile1 = require('/Users/todd/src/commonjs-concat/test/fixtures/test-file-1.js');",
    "exports.testFile2 = require('/Users/todd/src/commonjs-concat/test/fixtures/test_file-2.js');",
    "exports.testing = require('/Users/todd/src/commonjs-concat/test/fixtures/testing.json');",
    "exports.testing1 = require('/Users/todd/src/commonjs-concat/test/fixtures/more/testing.js');",
  ];

  concat('./fixtures', {
    relative: true,
    fileFilter: '*json'
  }, function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});

test('no json', function(t) {
  var results = ["exports.testFile1 = require('/Users/todd/src/commonjs-concat/test/fixtures/test-file-1.js');",
    "exports.testFile2 = require('/Users/todd/src/commonjs-concat/test/fixtures/test_file-2.js');",
    "exports.testing = require('/Users/todd/src/commonjs-concat/test/fixtures/more/testing.js');",
  ];

  concat('./fixtures', {
    relative: true,
  }, function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});