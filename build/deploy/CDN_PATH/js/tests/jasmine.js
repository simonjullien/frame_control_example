/**
 * User: emlyn
 * Date: 24/09/12
 * Time: 10:06 AM
 */
requirejs.config({
    shim: {
        'libs/jasmine-1.2.0/jasmine': {
            exports: 'jasmine'
        }
    }
});
define([
    'libs/jasmine-1.2.0/jasmine'
], function (jasmine) {

    require(['libs/console-runner','tests/testing-main'], function() {

        var console_reporter = new jasmine.ConsoleReporter();
        jasmine.getEnv().addReporter(console_reporter);
        jasmine.getEnv().execute();

    });



});