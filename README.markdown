
This is a simple javascript shim to support **require** in the browser.

Usage
=====

>Add a script tag at the top of your html page referencing require-shim.js:

            <script src="https://raw.github.com/omphalos/require-shim/master/require-shim.js"></script>

>Use **provide** to define a module, in javascript:

            provide(theModuleNameGoesHere, function(require, exports) {
                // your module definition goes here
            });

>Use **require** to import a module, in javascript:

           var yourModule = require(nameOfTheModuleYouWantToImport);

>Inside of **provide** you can use **exports** to expose functionality to other parts of your program:

            provide(theModuleNameGoesHere, function(require, exports) {
                exports.nameOfThingBeingExported = theThingYouWantToExport;
            });

Examples
========

>**Hello world**

>The following example defines a module called 'my-hello-world', adds a property called 'message' to it, and prints it on the screen.

            provide('my-hello-world', function(require, exports) {
                exports.message = 'hello world';
            });

            var myHelloWorld = require('my-hello-world');
            alert(myHelloWorld.message); // says 'hello world'

>**Importing one module into another**

>The following example defines a module called 'my-hello-world', adds a property called 'message' to it, and prints it on the screen.

            // define the first module
            provide('my-hello-world', function(require, exports) {
                exports.message = 'hello world';
            });
            
            provide('hello-world-length-calculator', function(require, exports) {
                // import it into the second module
                var myHelloWorld = require('my-hello-world');
                exports.length = myHelloWorld.message.length;
            });

            var helloWorldLengthCalculator = require('hello-world-length-calculator');
            alert(helloWorldLengthCalculator.length); // says 11 (since there are 11 characters in 'hello world')

>**Paths**

>You can wrap your module definitions using forward-slash path declarations, and traverse these paths using '.' and '..' syntax. This example demonstrates the use of relative paths to reference modules:

            provide('js/fruits/apple', function(require, exports) {
                exports.message = 'apples are yummy';
            });
            
            provide('js/fruits/banana', function(require, exports) {
                var apple = require('./apple'); // note the relative reference
                exports.message = apple.message + ' and so are bananas';
            });

            var banana = require('js/fruits/banana');
            alert(banana.message); // says 'apples are yummy and so are bananas'

How it works
============
    
>**provide** registers your module name and factory in a catalog.  

> **require** opens the catalog, looks for a module name and returns the module you asked for.

> Modules are lazily constructed.

Peaceful Disclaimer
===================

>**require** has been implemented a zillion times all over github.

>require-shim does not:

>* Use XMLHttpRequest
>* Use eval
>* Load asynchronously
>* Modify prototypes
>* Parse javascript
>* Automatically wrap Node.js modules for you
>* Combine your scripts into a single file for you
>* Minify anything
>* Use sorcery of any kind

>These are perfectly fine libraries out there that do these things.  Many people feel that features like these are important.  That is okay!  Please use whatever library you find the most enjoyable :)

Using Common JS modules (like Node.js) in the browser
=====================================================

>If you want to use something like a Node.js module in your browser, you will need to manually wrap the call in a provide statement.

>For example:

            provide('module', function(require, exports) {
            // the code you're wrapping
            });
