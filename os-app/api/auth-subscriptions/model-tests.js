/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var modelLibrary = require('./model');

describe('WKCSubscriptionTypeFeed', function testWKCSubscriptionTypeFeed() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypeFeed(), 'Feed');
	});

});

describe('WKCSubscriptionTypeFile', function testWKCSubscriptionTypeFile() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypeFile(), 'File');
	});

});

describe('WKCSubscriptionTypePage', function testWKCSubscriptionTypePage() {

	it('returns constant', function() {
		assert.strictEqual(modelLibrary.WKCSubscriptionTypePage(), 'Page');
	});

});

describe('WKCModelInputDataIsSubscriptionObject', function testWKCModelInputDataIsSubscriptionObject() {

	it('returns false if not object', function() {
		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(null), false);
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not string', function() {
		var item = {
			WKCSubscriptionURL: null,
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not filled', function() {
		var item = {
			WKCSubscriptionURL: '',
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns false with WKCErrors if WKCSubscriptionURL not formatted', function() {
		var item = {
			WKCSubscriptionURL: 'google.com',
		};

		assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
		assert.deepEqual(item.WKCErrors, {
			WKCSubscriptionURL: [
				'WKCErrorNotFormatted',
			],
		});
	});

	it('returns true', function() {
		assert.deepEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject({
			WKCSubscriptionURL: 'https://google.com',
		}), true);
	});

	context('WKCSubscriptionName', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = {
				WKCSubscriptionURL: 'https://google.com',
				WKCSubscriptionName: 123
			};

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionName: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionBlurb', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = {
				WKCSubscriptionURL: 'https://google.com',
				WKCSubscriptionBlurb: 123
			};

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionBlurb: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionFetchContent', function() {

		it('returns false with WKCErrors if not string', function() {
			var item = {
				WKCSubscriptionURL: 'https://google.com',
				WKCSubscriptionFetchContent: 123
			};

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionFetchContent: [
					'WKCErrorNotString',
				],
			});
		});

	});

	context('WKCSubscriptionFetchDate', function() {

		it('returns false with WKCErrors if not date', function() {
			var item = {
				WKCSubscriptionURL: 'https://google.com',
				WKCSubscriptionFetchDate: new Date('alfa'),
			};

			assert.strictEqual(modelLibrary.WKCModelInputDataIsSubscriptionObject(item), false);
			assert.deepEqual(item.WKCErrors, {
				WKCSubscriptionFetchDate: [
					'WKCErrorNotDate',
				],
			});
		});

	});

});

describe('WKCSubscriptionHiddenPropertyNames', function testWKCSubscriptionHiddenPropertyNames() {

	it('returns array', function() {
		assert.deepEqual(modelLibrary.WKCSubscriptionHiddenPropertyNames(), [
			'_id',
		]);
	});

});
