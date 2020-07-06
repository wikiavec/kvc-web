const { throws, deepEqual } = require('assert');

const mainModule = require('./main.js').default;
const KVCTemplate = require('./template.js');

const showdown = require('showdown');

describe('KVCTemplatePlaintextTitle', function test_KVCTemplatePlaintextTitle() {

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCTemplatePlaintextTitle(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle(''), '');
	});

	it('extracts if single', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle('alfa'), 'alfa');
	});

	it('extracts if multiple', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle('alfa\nbravo'), 'alfa');
	});

	it('extracts if blank', function() {
		deepEqual(mainModule.KVCTemplatePlaintextTitle('\nbravo'), '');
	});

});

describe('KVCTemplatePlaintextBody', function test_KVCTemplatePlaintextBody() {

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCTemplatePlaintextBody(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody(''), '');
	});

	it('extracts if single', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('alfa'), '');
	});

	it('extracts if multiple', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('alfa\nbravo'), 'bravo');
	});

	it('extracts if blank', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('\nbravo'), 'bravo');
	});

	it('extracts if double break', function() {
		deepEqual(mainModule.KVCTemplatePlaintextBody('alfa\n\nbravo'), 'bravo');
	});

});

describe('KVCTemplateReplaceLinks', function test_KVCTemplateReplaceLinks() {

	it('throws if param1 not string', function() {
		throws(function() {
			mainModule.KVCTemplateReplaceLinks(null, {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not object', function() {
		throws(function() {
			mainModule.KVCTemplateReplaceLinks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns param1', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('alfa', {}), 'alfa');
	});

	it('excludes if no replacement', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]]', {
			bravo: 'charlie',
		}), '[[alfa]]');
	});

	it('excludes if not double-bracket', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[alfa]', {
			alfa: 'bravo',
		}), '[alfa]');
	});

	it('includes if single', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo)');
	});

	it('includes if multiple', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]] [[charlie]]', {
			alfa: 'bravo',
			charlie: 'delta',
		}), '[alfa](bravo) [charlie](delta)');
	});

	it('includes if global', function() {
		deepEqual(mainModule.KVCTemplateReplaceLinks('[[alfa]] [[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo) [alfa](bravo)');
	});

});

describe('KVCTemplateHTML', function test_KVCTemplateHTML() {

	it('throws if param1 not showdown', function() {
		throws(function() {
			mainModule.KVCTemplateHTML({
				Converter: null,
			}, '');
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not string', function() {
		throws(function() {
			mainModule.KVCTemplateHTML(showdown, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string as p', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'alfa'), '<p>alfa</p>');
	});

	it('converts simple headers without anchors', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, '# alfa'), '<h1>alfa</h1>');
	});

	it('converts single newline as br', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'alfa\nbravo'), '<p>alfa<br />\nbravo</p>');
	});

	it('converts double newline as p', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'alfa\n\nbravo'), '<p>alfa</p>\n<p>bravo</p>');
	});

	it('converts www domains to links', function() {
		deepEqual(mainModule.KVCTemplateHTML(showdown, 'www.alfa.com'), '<p><a href="http://www.alfa.com">www.alfa.com</a></p>');
	});

});

describe('KVCTemplateReplaceTokens', function test_KVCTemplateReplaceTokens() {

	it('throws if param1 not showdown', function() {
		throws(function() {
			mainModule.KVCTemplateReplaceTokens({
				Converter: null,
			}, '');
		}, /KVCErrorInputNotValid/);
	});

	it('throws if not string', function () {
		throws(function () {
			mainModule.KVCTemplateReplaceTokens(showdown, null)
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(typeof mainModule.KVCTemplateReplaceTokens(showdown, ''), 'object');
	});

	context('KVCTemplateTokenPostTitle', function () {
		
		it('sets to KVCTemplatePlaintextTitle', function () {
			const item = 'alfa\nbravo';
			deepEqual(mainModule.KVCTemplateReplaceTokens(showdown, item)[KVCTemplate.KVCTemplateTokenPostTitle()], mainModule.KVCTemplatePlaintextTitle(item));
		});
	
	});

	context('KVCTemplateTokenPostBody', function () {
		
		it('sets to KVCTemplateHTML', function () {
			const item = 'alfa\n# bravo';
			deepEqual(mainModule.KVCTemplateReplaceTokens(showdown, item)[KVCTemplate.KVCTemplateTokenPostBody()], mainModule.KVCTemplateHTML(showdown, mainModule.KVCTemplatePlaintextBody(item)));
		});
	
	});

});

describe('KVCTemplateSubstitutePublicLinks', function test_KVCTemplateSubstitutePublicLinks() {

	it('throws if param1 not string', function () {
		throws(function () {
			mainModule.KVCTemplateSubstitutePublicLinks(null, {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not object', function () {
		throws(function () {
			mainModule.KVCTemplateSubstitutePublicLinks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		deepEqual(mainModule.KVCTemplateSubstitutePublicLinks('', {}), '');
	});

	it('ignores if no replacement', function() {
		deepEqual(mainModule.KVCTemplateSubstitutePublicLinks('[[alfa]]', {
			bravo: 'charlie',
		}), '[[alfa]]');
	});

	it('ignores if not double-bracket', function() {
		deepEqual(mainModule.KVCTemplateSubstitutePublicLinks('[alfa]', {
			alfa: 'bravo',
		}), '[alfa]');
	});

	it('replaces single', function() {
		deepEqual(mainModule.KVCTemplateSubstitutePublicLinks('[[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo)');
	});

	it('replaces multiple', function() {
		deepEqual(mainModule.KVCTemplateSubstitutePublicLinks('[[alfa]] [[charlie]]', {
			alfa: 'bravo',
			charlie: 'delta',
		}), '[alfa](bravo) [charlie](delta)');
	});

	it('replaces duplicate', function() {
		deepEqual(mainModule.KVCTemplateSubstitutePublicLinks('[[alfa]] [[alfa]]', {
			alfa: 'bravo',
		}), '[alfa](bravo) [alfa](bravo)');
	});

});