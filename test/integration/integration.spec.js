var get = global.getHttpFunction('get', {});
var post = global.getHttpFunction('post', {});

describe('integration tests', function () {
	ensureApp();

	describe('GET entities', function () {
		describe('for singular case', function() {
			var testCases = {
				v1: {
					dataVersion: 1,
					id: 1,
					dataFromInitForV3toV2: 'yeap',
					dataFromInitForV2toV1: 'rly?'
				},
				v2: {
					dataVersion: 2,
					id: 1,
					dataFromInitForV3toV2: 'yeap'
				},
				v3: {
					dataVersion: 3,
					id: 1,
					fieldFromV3: true
				}
			};

			['v1', 'v2', 'v3'].forEach(function(version) {
				describe('GET ' + version, function () {
					before(function (done) {
						get('entity/1/' + version, done);
					});

					it('should return data ' + version, function () {
						expect(bodyReturned).to.eql(testCases[version]);
					});
				});
			});
		});

		describe('for plural cases', function() {
			var testCases = {
				v1: [{
					dataVersion: 1,
					id: 1,
					dataFromInitForV3toV2: 'yeap',
					dataFromInitForV2toV1: 'rly?'
				}, {
					dataVersion: 1,
					id: 2,
					dataFromInitForV2toV1: 'indeed',
					dataFromInitForV3toV2: 'nice'
				}],
				v2: [{
					dataVersion: 2,
					id: 1,
					dataFromInitForV3toV2: 'yeap'
				}, {
					dataVersion: 2,
					id: 2,
					dataFromInitForV3toV2: 'nice'
				}],
				v3: [{
					dataVersion: 3,
					id: 1,
					fieldFromV3: true
				}, {
					dataVersion: 3,
					id: 2,
					fieldFromV3: true
				}],
				v4: [{
					dataVersion: 4,
					id: 1,
					fieldFromV3: true
				}, {
					dataVersion: 4,
					id: 2,
					fieldFromV3: true
				}]
			};

			['v1', 'v2', 'v3', 'v4'].forEach(function(version) {
				describe('GET ' + version, function () {
					before(function (done) {
						get('entities/' + version, done);
					});

					it('should return data ' + version, function () {
						expect(bodyReturned).to.eql(testCases[version]);
					});
				});
			});
		});
	});

	describe('POST correct entities', function () {
		var testCases = {
			v1: {
				dataVersion: 1,
				id: 1
			},
			v2: {
				dataVersion: 2,
				id: 1
			},
			v3: {
				dataVersion: 3,
				id: 1,
				fieldFromV3: true
			}
		};

		['v1', 'v2', 'v3'].forEach(function(version) {
			describe('POST ' + version, function () {
				before(function (done) {
					post('entity/' + version, testCases[version], done);
				});

				it('should return object in format of ' + version, function () {
					expect(bodyReturned).to.containSubset(testCases[version]);
				});
			});
		});
	});

	describe('when options is send to transform', function () {
		before(function (done) {
			post('entityNeedingOptions/v1', {
				dataVersion: 1,
				id: 1,
			}, done);
		});

		it('should handle them', function () {
			expect(bodyReturned).to.containSubset({
				dataVersion: 1,
				id: 1
			});
		});
	});

	describe('when transform returns an error', () => {
		describe('when input data is bad', () => {
			before(function (done) {
				post('entityReturningErrorOnTransform/v1', {
					badInputData: true,
					badOutputData: false,
					id: 1
				}, 500, done);
			});

			it('should handle them', function () {
				expect(bodyReturned).to.containSubset({
					message: 'bad data V1toV2'
				});
			});
		});

		describe('when output data is bad', () => {
			before(function (done) {
				post('entityReturningErrorOnTransform/v1', {
					badInputData: false,
					badOutputData: true,
					id: 1
				}, 500, done);
			});

			it('should handle them', function () {
				expect(bodyReturned).to.containSubset({
					message: 'bad data V2toV1'
				});
			});
		});

		describe('when data is good', () => {
			before(function (done) {
				post('entityReturningErrorOnTransform/v1', {
					badInputData: false,
					badOutputData: false,
					id: 1
				}, 200, done);
			});

			it('should handle them', function () {
				expect(bodyReturned).to.containSubset({
					id: 1
				});
			});
		});
	});

	describe('when we check for compatibility first', () => {
		describe('when data is compatible', () => {
			before(function (done) {
				get('entityCheckingCompatibility/v1', 200, done);
			});

			it('should return data', function () {
				expect(bodyReturned).to.containSubset([
					{id: 1},
					{id: 2}
				]);
			});
		});

		describe('when data is not compatible', () => {
			before(function (done) {
				get('entityCheckingCompatibility/v1?testDataNotCompatible=true', 500, done);
			});

			it('should handle them', function () {
				expect(bodyReturned).to.containSubset({
					message: 'Data incompatible with old version of endpoint, use new version'
				});
			});
		});

		describe('when new version of endpoint is used', () => {
			before(function (done) {
				get('entityCheckingCompatibility/v2?testDataNotCompatible=true', 200, done);
			});

			it('should return data', function () {
				expect(bodyReturned).to.containSubset([
					{id: 1},
					{id: 2}
				]);
			});
		});
	});
});
