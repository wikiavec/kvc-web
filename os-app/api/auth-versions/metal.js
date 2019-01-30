/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ WKCVersionsMetalCreate

exports.WKCVersionsMetalCreate = async function(databaseClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	let errors;
	if (errors = modelLibrary.WKCVersionsModelErrorsFor(inputData)) {
		return Promise.resolve(Object.assign(inputData, {
			WKCErrors: errors,
		}));
	}

	return Promise.resolve(Object.entries((await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_versions').insertOne(Object.assign(inputData, {
		WKCVersionID: parseInt(new Date() * 1).toString(),
	}))).ops.pop()).filter(function ([key, value]) {
		return modelLibrary.WKCVersionsHiddenPropertyNames().indexOf(key) === -1;
	}).reduce(function (coll, [key, value]) {
		coll[key] = value;

		return coll;
	}, {}));
};
