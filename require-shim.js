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
    
    var catalog = {}; 
    context.require = function(key) { 
        var catalogEntry = catalog[key];
        if(!catalogEntry) {
            var message = []; 
            for(var x in catalog) { message.push('"' + x + '"'); } 
            throw 'failed to resolve ["' + key + '"]; current keys are [' + message + ']'; 
        }
        if(!catalogEntry.singleton) {  
            var relativeRequire = function(key) { 
                var absoluteKey = key.substr(0, 2) == './' ?
                    catalogEntry.path + '/' + key.substr(2, key.length) :
                    key;
                return context.require(absoluteKey);
            };
            catalogEntry.factory(relativeRequire, catalogEntry.singleton = {}); 
        }
        return catalogEntry.singleton;
    };
    
    context.provide = function() {
        var path, key, factory;
        if(arguments.length == 2) {
            path = '';
            key = arguments[0];
            factory = arguments[1];
        }
        else if(arguments.length == 3) {
            path = arguments[0];            
            key = path + '/' + arguments[1];
            factory = arguments[2];
        } 
        else {
            throw'';
        }
        catalog[key] = { 
            path: path,
            factory: factory 
        };
    };
    
})(this);