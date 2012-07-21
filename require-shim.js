/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
*/
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