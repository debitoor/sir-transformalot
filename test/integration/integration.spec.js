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

					it('should return data v1', function () {
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
				}]
			};

			['v1', 'v2', 'v3'].forEach(function(version) {
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
				id: 434
			},
			v2: {
				dataVersion: 2,
				id: 323,
				dataFromInitForV3toV2: 'yeap'
			},
			v3: {
				dataVersion: 3,
				id: 4441,
				fieldFromV3: true
			}
		};

		['v1', 'v2', 'v3'].forEach(function(version) {
			describe('POST ' + version, function () {
				before(function (done) {
					post('entity/' + version, testCases[version], done);
				});

				it('should return object in format of ' + version, function () {
					expect(bodyReturned).to.eql(testCases[version]);
				});
			});
		});
	});
});