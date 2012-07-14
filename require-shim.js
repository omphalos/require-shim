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
        if(!catalogEntry.instance) {            
            catalogEntry.factory(context.require, catalogEntry.instance = {}); 
        }
        return catalogEntry.instance;
    };
    context.define = function(key, factory) {
        catalog[key] = { factory: factory };
    };
})(this);
