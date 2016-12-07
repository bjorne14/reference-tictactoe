require('./globals');

var JasmineReporters = require('jasmine-reporters');
var JasmineConsoleReporter = require('jasmine-console-reporter');
var consoleReporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});

var XMLReporter = new JasmineReporters.JUnitXmlReporter({
    savePath: ".",
    consolidateAll: false
});

jasmine.getEnv().addReporter(XMLReporter);
jasmine.getEnv().addReporter(consoleReporter);
