//var createPatches = require('../utils/create-patch');
//var sir = require('../../index');
//
//describe('upAndDown module test', function() {
//	var transform, result;
//
//	describe('transformFactory upwards', function() {
//		before(function () {
//			transform = sir(createPatches([
//				{
//					version: 'v2',
//					upgradeData: function(data, context) {
//						data.v2 = true;
//					}
//				},
//				{
//					version: 'v3',
//					upgradeData: function(data, context) {
//						data.v3 = true;
//					}
//				}
//			]));
//		});
//
//		var cases = [['v1', {v2: true, v3: true}], ['v2', {v3: true}], ['v3', {}]];
//
//		cases.forEach(function(oneCase) {
//			describe(oneCase[0], function() {
//				before(function (done) {
//					transform.upgradeData(oneCase[0], function(err, transformer) {
//						result = transformer({});
//						done();
//					});
//				});
//
//				it('should have expected data', function() {
//					expect(result).to.eql(oneCase[1]);
//				});
//			});
//		});
//	});
//
//	describe('transformFactory downwards', function() {
//		before(function(){
//			transform = sir(createPatches([
//				{
//					version: 'v2',
//					downgradeData: function(data, context) {
//						data.v2 = true;
//					}
//				},
//				{
//					version: 'v3',
//					downgradeData: function(data, context) {
//						data.v3 = true;
//					}
//				}
//			]));
//		});
//
//		var cases = [
//			['v3', {}],
//			['v2', {v3: true}],
//			['v1', {v3: true, v2: true}]
//		];
//
//		cases.forEach(function(oneCase) {
//			describe(oneCase[0], function() {
//				before(function (done) {
//					transform.downgradeData(oneCase[0], function(err, transformer) {
//						result = transformer({});
//						done();
//					});
//				});
//
//				it('should have expected data', function() {
//					expect(result).to.eql(oneCase[1]);
//				});
//			});
//		});
//	});
//
//	describe('when dealing with no patches', function() {
//		before(function(done) {
//			transform = sir([]);
//			transform.upgradeData('v1', function(err, transformer) {
//				result = transformer({foo: 'bar'});
//				done();
//			});
//		});
//
//		it('should return the input verbatim', function() {
//			expect(result).to.eql({foo: 'bar'});
//		});
//	});
//});
//
