describe('KVCCommon_Access', function test_KVCCommon_Access () {

	it('redirects KVCCommonIdentityRedirect', async function() {
		browser.assert.deepEqual((await (await browser.fetch('http://loc.tests' + OLSKTestingCanonical(require('./controller.js').OLSKControllerRoutes().KVCCommonIdentityRedirect))).text()).slice(0, 10), '<?xml vers');
	});

});
