/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var urlPackage = require('url');

//_ WKCSubscriptionTypeFeed

exports.WKCSubscriptionTypeFeed = function() {
	return 'Feed';
};

//_ WKCSubscriptionTypeFile

exports.WKCSubscriptionTypeFile = function() {
	return 'File';
};

//_ WKCSubscriptionTypePage

exports.WKCSubscriptionTypePage = function() {
	return 'Page';
};

//_ WKCModelInputDataIsSubscriptionObject

exports.WKCModelInputDataIsSubscriptionObject = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	}

	var errors = {};

	if (!urlPackage.parse(inputData.WKCSubscriptionURL || '').hostname) {
		errors.WKCSubscriptionURL = [
			'WKCErrorNotFormatted',
		];
	}

	if (inputData.WKCSubscriptionName) {
		if (typeof inputData.WKCSubscriptionName !== 'string') {
			errors.WKCSubscriptionName = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionBlurb) {
		if (typeof inputData.WKCSubscriptionBlurb !== 'string') {
			errors.WKCSubscriptionBlurb = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionFetchContent) {
		if (typeof inputData.WKCSubscriptionFetchContent !== 'string') {
			errors.WKCSubscriptionFetchContent = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionFetchDate) {
		if (!(inputData.WKCSubscriptionFetchDate instanceof Date) || Number.isNaN(inputData.WKCSubscriptionFetchDate.getTime())) {
			errors.WKCSubscriptionFetchDate = [
				'WKCErrorNotDate',
			];
		}
	}

	if (Object.keys(errors).length) {
		inputData.WKCErrors = errors;
		
		return false;
	}

	return true;
};

//_ WKCSubscriptionHiddenPropertyNames

exports.WKCSubscriptionHiddenPropertyNames = function() {
	return [
		'_id',
	];
};
