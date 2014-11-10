//var versions = require('../../lib/versions');
//
//var createPatches = require('../utils/create-patch');
//var getVersions = require('../utils/pluck')('version');
//
//describe('lib/versions', function () {
//	var transforms, result;
//
//	describe('get correct version range', function() {
//
//		before(function() {
//			transforms = createPatches([
//				{version: 'v1'}, {version: 'v2'}, {version: 'v3'}, {version: 'v4'}, {version: 'v5'}
//			], ['initialize']);
//		});
//
//		var cases = [
//			['from v2 to v4', 'v2', 'v4', ['v3', 'v4']],
//			['goes from v4 to v2', 'v4', 'v2', ['v4', 'v3']],
//			['should not do anything if `from` and `to` versions are the same', 'v4', 'v4', []]
//		];
//
//		cases.forEach(function (oneCase) {
//			describe(oneCase[0],function () {
//				before(function() {
//					result = versions.range(transforms, oneCase[1], oneCase[2]).map(getVersions);
//				});
//
//				it('should go from v2 to v4', function () {
//					expect(result).to.eql(oneCase[3]);
//				});
//			});
//		});
//	});
//
//	describe('version sorter', function() {
//		before(function () {
//			transforms = createPatches([
//				{version: 'v2'}, {version: 'v3'}, {version: 'v1'}
//			], ['initialize']);
//			result = versions.sort(transforms).map(getVersions);
//		});
//
//		it('should return sorted versions', function () {
//			expect(result).to.eql(['v1', 'v2', 'v3']);
//		});
//	});
//});
//
