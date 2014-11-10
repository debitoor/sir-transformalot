var get = global.getHttpFunction('get', {});
var post = global.getHttpFunction('post', {});

describe('integration tests', function () {
	ensureApp();

	describe('GET entitys', function () {
		describe('for singular case', function() {
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
					id: 1
				}, {
					dataVersion: 1,
					id: 2
				}],
				v2: [{
					dataVersion: 2,
					id: 1
				}, {
					dataVersion: 2,
					id: 2
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

					it('should return data v1', function () {
						expect(bodyReturned).to.eql(testCases[version]);
					});
				});
			});
		});
	});

	describe.skip('POST entitys', function () {
		describe('POSTing to v1', function () {
			describe('correct old data v1', function() {
				before(function (done) {
					post('entity/v1', {dataVersion: 1, id: 3}, done);
				});

				it('should return object in format of v1', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 1,
						id: 3
					});
				});
			});
			describe('incorrect old data v2', function() {
				before(function (done) {
					post('entity/v1', {dataVersion: 2, id: 3}, 400, done);
				});

				it('should return error', function () {
					expect(bodyReturned).to.eql({
						msg: 'data format mismatch'
					});
				});
			});
		});

		describe('POSTing to v2', function () {
			describe('POSTing correct old data to entity v2', function() {
				before(function (done) {
					post('entity/v2', {dataVersion: 2, id: 4}, done);
				});

				it('should return object in format of v2', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 2,
						id: 4
					});
				});
			});

			describe('POSTing incorrect old data to entity v2', function() {
				before(function (done) {
					post('entity/v2', {dataVersion: 1, id: 4}, done);
				});
				it('should return object in format of v2', function () {
					expect(bodyReturned).to.eql({
						msg: 'data format mismatch'
					});
				});
			});
		});

		describe('POSTing to v3', function () {
			describe('correct new data', function() {
				before(function (done) {
					post('entity/v3', {dataVersion: 3, id: 4, fieldFromV3: true}, done);
				});

				it('should return object in format of v2', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 2,
						id: 4
					});
				});
			});

			describe('POSTing incorrect old data v2', function() {
				before(function (done) {
					post('entity/v3', {dataVersion: 2, id: 4}, done);
				});
				it('should return error', function () {
					expect(bodyReturned).to.eql({
						msg: 'data format mismatch'
					});
				});
			});

			describe('POSTing incorrect old data v1', function() {
				before(function (done) {
					post('entity/v3', {dataVersion: 1, id: 4}, done);
				});
				it('should return error', function () {
					expect(bodyReturned).to.eql({
						msg: 'data format mismatch'
					});
				});
			});
		});
	});
});