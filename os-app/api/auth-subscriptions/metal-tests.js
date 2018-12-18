/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var metalLibrary = require('./metal');
var modelLibrary = require('./model');

const kTesting = {
	kTestingValidSubscription: function() {
		return {
			WKCSubscriptionURL: 'https://google.com',
			WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
		}
	},
};

describe('WKCMetalSubscriptionsCreate', function testWKCMetalSubscriptionsCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, '', function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns WKCErrors if not valid WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, {
			WKCSubscriptionURL: 'google.com',
			WKCSubscriptionType: modelLibrary.WKCSubscriptionTypePage(),
		}, function(err, responseJSON) {
			assert.deepEqual(responseJSON.WKCErrors, {
				WKCSubscriptionURL: [
					'WKCErrorNotFormatted',
				],
			});
			
			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionID: responseJSON.WKCSubscriptionID,
				WKCSubscriptionDateCreated: responseJSON.WKCSubscriptionDateCreated,
				WKCSubscriptionDateUpdated: responseJSON.WKCSubscriptionDateUpdated,
			}));

			assert.strictEqual(parseInt(responseJSON.WKCSubscriptionID) - (new Date()) > -200, true);
			assert.strictEqual(responseJSON.WKCSubscriptionDateCreated - (new Date()) > -200, true);
			assert.strictEqual(responseJSON.WKCSubscriptionDateUpdated - (new Date()) > -200, true);
			
			done();
		});
	});

});

describe('WKCMetalSubscriptionsRead', function testWKCMetalSubscriptionsRead() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, '0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsRead(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, subscriptionObject);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsUpdate', function testWKCMetalSubscriptionsUpdate() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, 1, {}, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '1', null, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param4 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '1', {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, '0', kTesting.kTestingValidSubscription(), function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCErrors if not valid WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionURL: 'google.com',
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON.WKCErrors, {
					WKCSubscriptionURL: [
						'WKCErrorNotFormatted',
					],
				});

				done();
			});
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			var newURL = 'https://yahoo.com';

			metalLibrary.WKCMetalSubscriptionsUpdate(WKCTestingMongoClient, subscriptionObject.WKCSubscriptionID, {
				WKCSubscriptionURL: newURL,
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON, Object.assign(subscriptionObject, {
					WKCSubscriptionURL: newURL,
					WKCSubscriptionDateUpdated: responseJSON.WKCSubscriptionDateUpdated,
				}));
				assert.strictEqual(responseJSON.WKCSubscriptionDateUpdated - (new Date()) > -200, true);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsDelete', function testWKCMetalSubscriptionsDelete() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCSubscriptionID not found', function(done) {
		metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, '0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCSubscription', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, responseJSON) {
			metalLibrary.WKCMetalSubscriptionsDelete(WKCTestingMongoClient, responseJSON.WKCSubscriptionID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, true);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsSearch', function testWKCMetalSubscriptionsSearch() {

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns all if param2 empty', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, kTesting.kTestingValidSubscription(), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', function(err, responseJSON) {
				assert.deepEqual(responseJSON, [subscriptionObject]);

				done();
			});
		});
	});

	it('excludes if WKCArticleIsDiscarded true', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
			WKCArticleIsDiscarded: true,	
		}), function(err, subscriptionObject) {
			metalLibrary.WKCMetalSubscriptionsSearch(WKCTestingMongoClient, '', function(err, responseJSON) {
				assert.deepEqual(responseJSON, []);

				done();
			});
		});
	});

});

describe('WKCMetalSubscriptionsNeedingFetch', function testWKCMetalSubscriptionsNeedingFetch() {

	it('throws error if param2 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns subscriptionObjects with fetch date older than one hour', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionName: 'alfa',
			WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
		}), function(err, subscriptionObject1) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'bravo',
				WKCSubscriptionFetchDate: new Date(),
			}), function(err, subscriptionObject2) {
				metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject1]);

					done();
				});
			});
		});
	});

	it('returns subscriptionObjects with no fetch date', function(done) {
		metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
			WKCSubscriptionName: 'alfa',
			WKCSubscriptionFetchDate: new Date(),
		}), function(err, subscriptionObject1) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'bravo',
			}), function(err, subscriptionObject2) {
				metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [subscriptionObject2]);

					done();
				});
			});
		});
	});

	context('error', function() {

		it('excludes subscriptionObjects with error date less than one hour', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionErrorDate: new Date(),
			}), function(err, subscriptionObject) {
				metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject) {
					metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, []);

						done();
					});
				});
			});
		});

		it('includes subscriptionObjects with error date older than one hour', function(done) {
			metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
				WKCSubscriptionName: 'alfa',
				WKCSubscriptionFetchDate: new Date(new Date() - 1000 * 60 * 60),
				WKCSubscriptionErrorDate: new Date(new Date() - 1000 * 60 * 60),
			}), function(err, subscriptionObject1) {
				metalLibrary.WKCMetalSubscriptionsCreate(WKCTestingMongoClient, Object.assign(kTesting.kTestingValidSubscription(), {
					WKCSubscriptionName: 'bravo',
					WKCSubscriptionFetchDate: new Date(),
				}), function(err, subscriptionObject2) {
					metalLibrary.WKCMetalSubscriptionsNeedingFetch(WKCTestingMongoClient, function(err, responseJSON) {
						assert.deepEqual(responseJSON, [subscriptionObject1]);

						done();
					});
				});
			});
		});

	});

});
