var createPatches = require('../utils/create-patch');
var sir = require('../../index');

describe('unAndDown module test', function() {
	var transform, result;

	describe('transform upwards', function() {
		before(function () {
			transform = sir(createPatches([
				{
					version: 'v2',
					up: function(data, context) {
						data.v2 = true;
					}
				},
				{
					version: 'v3',
					up: function(data, context) {
						data.v3 = true;
					}
				}
			]));
		});

		var cases = [['v1', {v2: true, v3: true}], ['v2', {v3: true}], ['v3', {}]];

		cases.forEach(function(oneCase) {
			describe(oneCase[0], function() {
				before(function (done) {
					transform.up(oneCase[0], function(err, transformer) {
						result = transformer({});
						done();
					});
				});

				it('should have expected data', function() {
					expect(result).to.eql(oneCase[1]);
				});
			});
		});
	});

	describe('transform downwards', function(t) {
		before(function(){
			result = sir(createPatches([
				{
					version: 'v2',
					down: function(data, context) {
						data.v2 = true;
					}
				},
				{
					version: 'v3',
					down: function(data, context) {
						data.v3 = true;
					}
				}
			]));
		});

		var cases = [
			['v3', {}],
			['v2', {v3: true}],
			['v1', {v3: true, v2: true}]
		];

		cases.forEach(function(oneCase) {
			describe(oneCase[0], function() {
				before(function (done) {
					transform.up(oneCase[0], function(err, transformer) {
						result = transformer({});
						done();
					});
				});

				it('should have expected data', function() {
					expect(result).to.eql(oneCase[1]);
				});
			});
		});
	});

	describe('when dealing with no patches', function(t) {
		before(function(done) {
			transform = sir([]);
			transform.up('v1', function(err, transformer) {
				result = transformer({foo: 'bar'});
				done();
			});
		});

		it('should return the input verbatim', function() {
			expect(result).to.eql({foo: 'bar'});
		});
	});
});

