/**
 * User: emlyn
 * Date: 20/09/12
 * Time: 4:12 PM
 *
 * This is the main test file.  Write Jsmine tests to test the functionality of the site.
 * see http://pivotal.github.com/jasmine/
 *
 */
define(['jquery','tests/jasmine'], function($) {

    describe("Tests", function() {

		describe("Framework Tests", function() {
	
			it("load requirejs", function() {

				waitsFor(function() {
					try {
						requirejs("main");
						return true;
					} catch(e) {
						return false;
					}

				}, "RequireJS timeout", 12000);


			});
		
		});


    });

});