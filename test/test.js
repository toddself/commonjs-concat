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
  ];

  concat('./fixtures', {
  }, function(err, concated) {
    concated.split('\n').forEach(function(file){
      t.notEqual(results.indexOf(file), -1, file+' located');
    })
    t.end();
  });
});