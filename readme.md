[![build status](https://secure.travis-ci.org/toddself/commonjs-concat.png)](http://travis-ci.org/toddself/commonjs-concat)

# commonjs-concat

Take a directory of files and create a single file which exports all the files in the directory structure.

## Usage

### CLI

```
$ npm i -g commonjs-concat
$ tree test/fixtures
test/fixtures
├── more
│   └── testing.js
├── test-file-1.js
├── test_file-2.js
└── testing.json
$ cjs-concat test/fixtures
exports.testFile1 = require('/Users/todd/src/commonjs-concat/test/fixtures/test-file-1.js');
exports.testFile2 = require('/Users/todd/src/commonjs-concat/test/fixtures/test_file-2.js');
exports.testing = require('/Users/todd/src/commonjs-concat/test/fixtures/more/testing.js');
# cjs-concat test/fixtures --no-relative -f"*json"
exports.testFile1 = require('./test-file-1.js');
exports.testFile2 = require('./test_file-2.js');
exports.testing = require('./testing.json');
exports.testing1 = require('./more/testing.js');
```

### API

```js
> var concat = require('commonjs-concat');
> concat('test/fixtures', {includeFile: '*json', relative: false}, function(err, output) {
  console.log(output);
});
exports.testFile1 = require('./test-file-1.js');
exports.testFile2 = require('./test_file-2.js');
exports.testing = require('./testing.json');
exports.testing1 = require('./more/testing.js');
```

### Licence
Copyright 2015 Todd Kennedy, Apache 2 license