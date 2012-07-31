(function(context) {
    "use strict";
    
    var catalog = {}; // the catalog tracks all the modules that have been defined
    
    // require imports functionality
    context.require = function(key) {
    
        var catalogEntry = catalog[key];
        
        // throw a descriptive error message if the key is missing
        if(!catalogEntry) {
            var message = [];
            for(var x in catalog) {
                if(catalog.hasOwnProperty(x)) {
                    message.push('"' + x + '"');
                }
            }
            throw 'failed to resolve ["' + key + '"]; current keys are [' + message + ']';
        }
        
        // the catalog entry is a lazy-initialized singleton
        if(!catalogEntry.singleton) {
            
            // we need to support looking things up with relative paths, for example "./lib/module" and '../lib/module'
            var relativeRequire = function(key) {
                                
                var normalizedKey;
                if(key.substr(0, 2) === './') {
                    // handle ./lib/module
                    normalizedKey = catalogEntry.path + '/' + key.substr(2, key.length);
                } else if(key.substr(0, 3) === '../') {
                    // handle ../lib/module
                    normalizedKey = catalogEntry.path + '/' + key;
                } else {
                    normalizedKey = key;
                }
                                    
                // handle lib/../module and lib/./module
                if(key.indexOf('/.') >= 0) {
                    var keyParts = normalizedKey.split('/');
                    var normalizedKeyParts = [];
                    for(var k = 0; k < keyParts.length; k++) {
                        var part = keyParts[k];
                        if(part === '..') {
                            if(normalizedKeyParts.length === 0) {
                                throw 'cannot resolve top-level folder for ".." in key "' + key + '" inside of path "' + catalogEntry.path + '"';
                            }
                            normalizedKeyParts.pop();
                        } else if(part !== '.') {
                            normalizedKeyParts.push(part);
                        }
                    }
                    normalizedKey = normalizedKeyParts.join('/');
                }
                
                return context.require(normalizedKey);
            };
            
            // initialize the singleton (this will break dependency cycles)
            catalogEntry.singleton = {};
            catalogEntry.factory(relativeRequire, catalogEntry.singleton); // invoke the factory method
        }
        
        return catalogEntry.singleton;
    };
    
    context.provide = function(key, factory) {
    
        var keyParts = key.split('/');
        
        // paths like 'a/../c' and './b' aren't supported by provide
        for(var p = 0; p < keyParts.length; p++) {
            var part = keyParts[p];
            if(part === '.') { throw '"." not supported as part of the key: "' + key + '"'; }
            else if(part === '..') { throw '".." not supported as part of the key: "' + key + '"'; }
        }
        
        // calculate the path
        //   for 'a/b/c' the path will be a/b;
        //   for 'module' the path will be ''
        var path  = key.length > 1 ? keyParts.slice(0, keyParts.length - 1).join('/') : '';
        catalog[key] = {
            path: path,
            factory: factory
        };
    };
    
}(this));