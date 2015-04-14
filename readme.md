# Schemachine

Schemachine is a [Mongoose](http://mongoosejs.com/) schema loader.


## Documentation

[mongoosejs.com](http://mongoosejs.com/)


## Installation

First install [node.js](http://nodejs.org/) [mongodb](http://www.mongodb.org/downloads) and [mongoosejs](http://mongoosejs.com/). Then:

```sh
$ npm install schemachine
```

## Overview

To use Schemachine require it and execute the load function at the begining of your node server.

```js
var mongoose = require('mongoose');
var schemachine = require('schemachine');
schemachine.load(__dirname + '/mydir', 'models');
```

This will load all js files located in any "models" folders contained within /mydir

To use loaded schemas in your application. Require Mongoose and schemachine.
Then schemas can be accessed through schemachine.schemafilename.

```js
var mongoose = require('mongoose');
var schemachine = require('schemachine');
schemachine.schemafilename.findOne({},function(err,result){
    console.log(result);
});
```


Copyright (c) 2015 Killerwave

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
