var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var Path = require("path");
var monger = {};
monger.loaded = false;
monger.load = function(dirName, modelFolder) {
    return readDir(dirName, modelFolder).then(function(files){
        files.forEach(function(filename) {
            if(filename) {
                var newschema = require(filename);
                schemaname = filename.substr(0, filename.lastIndexOf('.'));
                if(newschema instanceof Function || typeof(newschema) === 'function') {
                    monger[newschema.modelName] = newschema;
                }
                else if(newschema instanceof Object) {
                    var keys = Object.keys(newschema);
                    keys.forEach(function(k) {
                        monger[k] = newschema[k];
                    });
                }
            }
        });
        
        monger.loaded = true;
    });
};
function readDir(dirName, modelFolder) {
    return fs.readdirAsync(dirName).map(function (fileName) {
        var path = Path.join(dirName, fileName);
        return fs.statAsync(path).then(function(stat) {
            var parts = path.split(Path.sep);
            if(!stat.isDirectory()){
                // it's a file, is it in the modelFolder?
                var dir = parts[parts.length -2];
                if(dir === modelFolder) {
                    return path;
                }
            } else {
                if(parts[parts.length -1] !== "node_modules") {
                    return readDir(path, modelFolder);
                }
            }
        });
    }).reduce(function (a, b) {
        if(typeof a == "undefined") {
            a = [];
        }
        if(a.length > 0 || b) {
            return a.concat(b);
        }
    }, []);
}
module.exports = monger;
