/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var diffLibrary = require('./diff');

const kTests = {
	kTestsRSSInvalid: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channell></channel></rss>';
	},
	kTestsRSSValid: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><item><title>bravo</title><guid>bravo</guid><description></description></item><item><title>alfa</title><guid>alfa</guid><description></description></item></channel></rss>';
	},
	kTestsRSSComplete: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><item><title>alfa</title><link>https://www.cbc.ca/bravo</link><guid isPermaLink="false">charlie</guid><pubDate>Fri, 7 Dec 2018 10:03:15 EST</pubDate><author>delta</author><description><![CDATA[\
                        <p>echo</p>\
        ]]>\
        </description></item></channel></rss>';
	},
};

describe('WKCDiffArticlesForFeed', function testWKCDiffArticlesForFeed() {

	it('returns none if new invalid', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(kTests.kTestsRSSValid(), kTests.kTestsRSSInvalid()), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSValid()).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'bravo',
			'alfa',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(kTests.kTestsRSSValid(), kTests.kTestsRSSValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'charlie',
		]);
	});

	it('populates article title', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleTitle, 'alfa');
	});

	it('populates article link', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleOriginalURL, 'https://www.cbc.ca/bravo');
	});

	it('populates article guid', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleOriginalGUID, 'charlie');
	});

	it('populates article date', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates article author', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleAuthor, 'delta');
	});

	it('populates article body', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleBody, '<p>echo</p>');
	});

});

describe('_WKCDiffArticleBodyForFile', function test_WKCDiffArticleBodyForFile() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			diffLibrary._WKCDiffArticleBodyForFile(null, 'alfa');
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			diffLibrary._WKCDiffArticleBodyForFile('alfa', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns string if identical', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alfa'), 'alfa');
	});

	it('returns string if character added', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alfab'), 'alfa<ins>b</ins>');
	});

	it('returns string if character removed', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alf'), 'alf<del>a</del>');
	});

	it('returns string if character changed', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alfo'), 'alf<del>a</del><ins>o</ins>');
	});

	it('escapes html tags', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('<b>alfa</b>', '<b>alfax</b>'), '&lt;b&gt;alfa<ins>x</ins>&lt;/b&gt;');
	});

});

describe('WKCDiffArticlesForFile', function testWKCDiffArticlesForFile() {

	it('returns none if identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfa'), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfo').map(function(e) {
			return e.WKCArticleBody;
		}), [
			'alf<del>a</del><ins>o</ins>'
		]);
	});

});
