/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var suggestLibrary = require('./suggest');

describe('WKCSubscriptionsModuleCreateSuggestFor', function testWKCSubscriptionsModuleCreateSuggestFor() {

	it('throws error if not string', function() {
		assert.throws(function() {
			suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if empty', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor(''), []);
	});

	it('returns none if blank', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor(' '), []);
	});

	it('returns urls from keyword', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa'), [
			'https://alfa.com',
			'http://alfa.com',
			]);
	});

	it('returns urls from domain', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa.com'), [
			'https://alfa.com',
			'http://alfa.com',
			]);
	});

	it('returns urls from domain with slash', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('alfa.com/bravo'), [
			'https://alfa.com/bravo',
			'http://alfa.com/bravo',
			]);
	});

	it('returns https if no http', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('http://alfa.com/bravo'), [
			'https://alfa.com/bravo',
			]);
	});

	it('returns none if https', function() {
		assert.deepEqual(suggestLibrary.WKCSubscriptionsModuleCreateSuggestFor('https://alfa.com/bravo'), []);
	});

});