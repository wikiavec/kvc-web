const { throws, deepEqual } = require('assert');

const mainModule = require('./storage.js').default;

describe('KVCNoteStoragePath', function test_KVCNoteStoragePath() {

	it('returns string', function() {
		deepEqual(mainModule.KVCNoteStoragePath('alfa'), 'kvc_notes/alfa');
	});

	it('returns string if blank', function() {
		deepEqual(mainModule.KVCNoteStoragePath(''), 'kvc_notes/');
	});

	it('returns string if undefined', function() {
		deepEqual(mainModule.KVCNoteStoragePath(), 'kvc_notes/');
	});

});
