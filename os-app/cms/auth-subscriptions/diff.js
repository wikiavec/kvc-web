/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var jsDOMPackage = require('jsdom');
const { JSDOM } = jsDOMPackage;
const fastXMLParserPackage = require('fast-xml-parser');
const diffPackage = require('diff');
var htmlEntitiesPackage = require('html-entities');
htmlEntitiesPackage = new (htmlEntitiesPackage.AllHtmlEntities)();
var turndownPackage = require('turndown');
turndownPackage = new turndownPackage();
turndownPackage.remove('script');
var showdownPackage = require('showdown');
showdownPackage = new showdownPackage.Converter();
showdownPackage.setOption('noHeaderId', true);

//_ WKCDiffArticlesForFeed

exports.WKCDiffArticlesForFeed = function(oldString, newString) {
	var oldIDs = (!oldString ? [] : fastXMLParserPackage.parse(oldString).rss.channel.item).map(function(e) {
		return e.guid.toString();
	});
	var newItems = fastXMLParserPackage.parse(newString);

	if (!(newItems = newItems.rss)) {
		return [];
	}

	if (!(newItems = newItems.channel)) {
		return [];
	}

	if (!(newItems = newItems.item)) {
		return [];
	}

	if (typeof newItems === 'object' && !!newItems.guid) {
		newItems = [newItems]
	}

	if (!Array.isArray(newItems)) {
		return [];
	}

	return newItems.filter(function(e) {
		e.guid = e.guid.toString();

		return oldIDs.indexOf(e.guid) === -1;
	}).map(function(e) {
		var itemContent = (e['content:encoded'] || e.description).trim();

		return {
			WKCArticleTitle: e.title,
			WKCArticleOriginalURL: e.link,
			WKCArticleOriginalGUID: e.guid,
			WKCArticlePublishDate: new Date(e.pubDate),
			WKCArticleAuthor: e.author,
			WKCArticleBody: itemContent,
			WKCArticleSnippet: exports.WKCSnippetFromText(JSDOM.fragment(itemContent).textContent),
		};
	});
};

//_ _WKCDiffArticleBodyForStrings

exports._WKCDiffArticleBodyForStrings = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	var changesArray = diffPackage.diffChars(oldString || '', newString);

	return changesArray.map(function(e) {
		if (e.added === true) {
			return [
				'<ins>',
				e.value,
				'</ins>',
			].join('');
		}

		if (e.removed === true) {
			return [
				'<del>',
				e.value,
				'</del>',
			].join('');
		}

		return e.value;
	}).join('');
};

//_ WKCDiffArticlesForFile

exports.WKCDiffArticlesForFile = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}
	
	if (oldString === newString) {
		return [];
	}

	return [{
		WKCArticleBody: exports._WKCDiffArticleBodyForStrings(htmlEntitiesPackage.encode(oldString), htmlEntitiesPackage.encode(newString)),
		WKCArticlePublishDate: new Date(),
	}];
};

//_ WKCDiffArticlesForPage

exports.WKCDiffArticlesForPage = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	oldString = showdownPackage.makeHtml(turndownPackage.turndown((new JSDOM(oldString || '')).window.document.body.innerHTML));
	newString = showdownPackage.makeHtml(turndownPackage.turndown((new JSDOM(newString)).window.document.body.innerHTML));
	
	if (oldString === newString) {
		return [];
	}

	return [{
		WKCArticleBody: exports._WKCDiffArticleBodyForStrings(oldString, newString),
		WKCArticlePublishDate: new Date(),
	}];
};

//_ WKCSnippetFromText

exports.WKCSnippetFromText = function(inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	return inputData.length <= 100 ? inputData : inputData.slice(0, 100).split(' ').slice(0, -1).join(' ').concat('…');
};

