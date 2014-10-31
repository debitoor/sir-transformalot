var test = require('tape');
var patch = require('../lib/patch');

var createPatches = require('./utils/create-patch');

test('initializing transform', function(t) {
	t.plan(2);
	var transforms = createPatches([
		{initialize: function(context, done){ done(); }}
	]);

	patch.initializeAll(transforms, function(err, context) {
		t.error(err, 'return null if there was no errors during initialization');
		t.deepEquals({}, context, 'return a context object');
	});
});

test('initializing transform returning errors', function(t) {
	t.plan(2);
	var transforms = createPatches([
		{initialize: function(context, done){ done(new Error('ouch')); }}
	]);

	patch.initializeAll(transforms, function(err, context) {
		t.ok(err instanceof Error, 'should not return a context object');
		t.deepEquals(undefined, context, 'should not return a context object');
	});
});
