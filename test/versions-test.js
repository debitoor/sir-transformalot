var test = require('tape');
var versions = require('../lib/versions');

var createPatches = require('./utils/create-patch');
var pluck = require('./utils/pluck');
var getVersions = require('./utils/pluck')('version');

test('get correct version range', function(t) {
	var transforms = createPatches([
		{version: 'v1'}, {version: 'v2'}, {version: 'v3'}, {version: 'v4'}, {version: 'v5'}
	], ['initialize']);

	t.deepEquals(
		versions.range(transforms, 'v2', 'v4').map(getVersions),
		['v3', 'v4'],
		'goes from v2 to v4'
	);

	t.deepEquals(
		versions.range(transforms, 'v4', 'v2').map(getVersions),
		['v4', 'v3'],
		'goes from v4 to v2'
	);

	t.deepEquals(
		versions.range(transforms, 'v4', 'v4').map(getVersions),
		[],
		'should not do anything if `from` and `to` versions are the same'
	);
	t.end();
});

test('version sorter', function(t) {
	var transforms = createPatches([
		{version: 'v2'}, {version: 'v3'}, {version: 'v1'}
	], ['initialize']);

	t.deepEquals(
		versions.sort(transforms).map(getVersions),
		['v1', 'v2', 'v3'],
		'should sort versions in ascending order'
	);
	t.end();
});
