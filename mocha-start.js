(function KVCMochaBrowerHost() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	browser.site = process.env.KVC_SHARED_REF_HOST + ':3000';
})();


(function KVCMochaMongo() {
	var mongodbPackage = require('mongodb');

	before(function(done) {
		mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}, function(err, client) {
			if (err) {
				throw err;
			}

			global.KVCTestingMongoClient = client;

			done();
		});
	});

	after(function() {
		if (!global.KVCTestingMongoClient) {
			return;
		}

		global.KVCTestingMongoClient.close();
	});

	beforeEach(async function() {
		global.KVCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});
})();

const KVCStorageModule = require('./os-app/_shared/KVCStorageModule/main.js');
const KVCNoteStorage = require('./os-app/_shared/KVCNote/storage.js');
const KVCSettingStorage = require('./os-app/_shared/KVCSetting/storage.js');
const KVCVersionStorage = require('./os-app/_shared/KVCVersion/storage.js');

(function KVCMochaStorage() {
	if (process.env.OLSK_TESTING_BEHAVIOUR === 'true') {
		return;
	}

	const uSerial = function (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	};

	before(function(done) {
		global.KVCTestingStorageClient = require('./os-app/_shared/KVCStorageClient/main.js').KVCStorageClient({
			modules: [
				KVCStorageModule.KVCStorageModule([
					KVCNoteStorage.KVCNoteStorage,
					KVCSettingStorage.KVCSettingStorage,
					KVCVersionStorage.KVCVersionStorage,
				].map(function (e) {
					return {
						KVCCollectionStorageGenerator: e,
						KVCCollectionChangeDelegate: null,
					};
				}))
			],
		});

		done();
	});

	beforeEach(async function() {
		await uSerial([
			'kvc_notes',
			'kvc_settings',
			'kvc_versions',
		].map(async function (e) {
			return await Promise.all(Object.keys(await global.KVCTestingStorageClient.wikiavec[e].listObjects()).map(global.KVCTestingStorageClient.wikiavec[e].deleteObject));
		}));
	});
})();
