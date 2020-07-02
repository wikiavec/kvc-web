const { throws, rejects, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

const kTesting = {
	StubNoteObjectValid() {
		return {
			KVCNoteID: 'alfa',
			KVCNoteBody: 'bravo',
			KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('KVCNoteStorageCollectionType', function test_KVCNoteStorageCollectionType() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionType(), 'kvc_note');
	});

});

describe('KVCNoteStorageCollectionPath', function test_KVCNoteStorageCollectionPath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageCollectionPath(), 'kvc_notes/');
	});

});

describe('KVCNoteStorageFolderPath', function test_KVCNoteStorageFolderPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStorageFolderPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = kTesting.StubNoteObjectValid();
		deepEqual(mainModule.KVCNoteStorageFolderPath(item), mainModule.KVCNoteStorageCollectionPath() + item.KVCNoteCreationDate.toJSON().split('T').shift() + '/' + item.KVCNoteID + '/');
	});

});

describe('KVCNoteStorageObjectPath', function test_KVCNoteStorageObjectPath() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPath({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid()), mainModule.KVCNoteStorageFolderPath(kTesting.StubNoteObjectValid()) + 'main');
	});

});

describe('KVCNoteStorageObjectPathV1', function test_KVCNoteStorageObjectPathV1() {

	it('throws error if not valid', function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPathV1({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = kTesting.StubNoteObjectValid();
		deepEqual(mainModule.KVCNoteStorageObjectPathV1(item), mainModule.KVCNoteStorageCollectionPath() + item.KVCNoteID);
	});

});

describe('KVCNoteStorageMatchV1', function test_KVCNoteStorageMatchV1() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCNoteStorageMatchV1(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		const item = mainModule.KVCNoteStorageCollectionPath();
		deepEqual(mainModule.KVCNoteStorageMatchV1(mainModule.KVCNoteStorageObjectPathV1(kTesting.StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPathV1', function() {
		deepEqual(mainModule.KVCNoteStorageMatchV1(mainModule.KVCNoteStorageObjectPathV1(kTesting.StubNoteObjectValid()) + '/'), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KVCNoteStorageMatchV1(mainModule.KVCNoteStorageObjectPathV1(kTesting.StubNoteObjectValid())), true);
	});

});

describe('KVCNoteStorageMatch', function test_KVCNoteStorageMatch() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.KVCNoteStorageMatch(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no KVCNoteStorageCollectionPath', function() {
		const item = mainModule.KVCNoteStorageCollectionPath();
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid()).replace(item, item.slice(0, -2) + '/')), false);
	});

	it('returns false if no KVCNoteStorageObjectPath', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid()).slice(0, -1)), false);
	});

	it('returns true', function() {
		deepEqual(mainModule.KVCNoteStorageMatch(mainModule.KVCNoteStorageObjectPath(kTesting.StubNoteObjectValid())), true);
	});

	it('returns false if old path', function () {
		deepEqual(mainModule.KVCNoteStorageMatch('kvc_notes/01EC08S8BG8WJVM4ZYMGC7EK9W/main'), false);
	});

});

describe('KVCNoteStorageObjectPathPublic', function test_KVCNoteStorageObjectPathPublic() {

	it('throws if not valid', async function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPathPublic({});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if no KVCNotePublicID', async function() {
		throws(function() {
			mainModule.KVCNoteStorageObjectPathPublic(kTesting.StubNoteObjectValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', async function() {
		const item = Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});

		deepEqual(await mainModule.KVCNoteStorageObjectPathPublic(item), '/' + item.KVCNotePublicID);
	});

});

describe('KVCNoteStorageWritePublic', function test_KVCNoteStorageWritePublic() {

	const item = Object.assign(kTesting.StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteStorageWritePublic(KVCTestingStorageClient, {}, 'alfa'), /KVCErrorInputNotValid/);
	});

	it('rejects if not object path', async function() {
		await rejects(mainModule.KVCNoteStorageWritePublic(KVCTestingStorageClient, kTesting.StubNoteObjectValid(), '/'), /KVCErrorInputNotValid/);
	});

	it('returns public url', async function() {
		deepEqual(await mainModule.KVCNoteStorageWritePublic(KVCTestingStorageClient, kTesting.StubNoteObjectValid(), '/alfa'), undefined);
	});

	it('writes file to public folder', async function() {
		await mainModule.KVCNoteStorageWritePublic(KVCTestingStorageClient, item, mainModule.KVCNoteStorageObjectPathPublic(item));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile(mainModule.KVCNoteStorageObjectPathPublic(item))).data, 'bravo');
	});

});

describe('KVCNoteStoragePublicDelete', function test_KVCNoteStoragePublicDelete() {

	it('rejects if not object path', async function() {
		await rejects(mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, '/'), /KVCErrorInputNotValid/);
	});

	it('returns undefined', async function() {
		deepEqual(await mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, '/alfa'), {
			statusCode: 200,
		});
	});

	it('deletes file from public folder', async function() {
		const item = Object.assign(kTesting.StubNoteObjectValid(), {
			KVCNotePublicID: 'charlie',
		});
		await mainModule.KVCNoteStorageWritePublic(KVCTestingStorageClient, item, mainModule.KVCNoteStorageObjectPathPublic(item));

		await mainModule.KVCNoteStoragePublicDelete(KVCTestingStorageClient, mainModule.KVCNoteStorageObjectPathPublic(item));

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG._OLSKRemoteStoragePublicClient().getFile(mainModule.KVCNoteStorageObjectPathPublic(item))).data, undefined);
	});

});
