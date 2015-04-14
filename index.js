var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var schemachine = {};
schemachine.loaded = false;

schemachine.load = function(dir, schemaFolder) {
    var file = '';
    var filename = '';
    walkLoad(dir, schemaFolder, function(err, results){
        for(var result in results)
        {
            file = results[result];
            filename = path.basename(file);
            if (~filename.indexOf('.js'))
                {
                    schemaname = filename.substr(0, filename.lastIndexOf('.'));
                    schemachine[schemaname] = require(file);
                }
        }
    });
};


function walkLoad(dir, schemaFolder, done) {
    console.log('walkload!');
    var results = [];
    var parts = [];
    var lastpart = '';
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                  walkLoad(file, schemaFolder, function(err, res) {
                    results = results.concat(res);
                    if (!--pending) done(null, results);
                  });
                }
                else
                {
                    parts = dir.toString().split(path.sep);
                    lastpart = parts[parts.length - 1];
                    if (lastpart === schemaFolder)
                    {
                        results.push(file); 
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

module.exports = schemachine;