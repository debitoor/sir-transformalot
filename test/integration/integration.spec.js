var get = global.getHttpFunction('get', {});
var post = global.getHttpFunction('post', {});

describe('integration tests', function () {
	ensureApp();

	describe('GET entitys', function () {
		describe('for singular case', function() {
			describe('GET v1', function () {
				before(function (done) {
					get('entity/1/v1', done);
				});

				it('should return data v1', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 1,
						id: 1
					});
				});
			});

			describe('GET v2', function () {
				before(function (done) {
					get('entity/1/v2', done);
				});

				it('should return data v2', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 2,
						id: 1
					});
				});
			});

			describe('GET v3', function () {
				before(function (done) {
					get('entity/1/v3', done);
				});

				it('should return data v3', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 3,
						id: 1,
						fieldFromV3: true
					});
				});
			});
		});

		describe('for plural cases', function() {
			describe('GET v1', function () {
				before(function (done) {
					get('entities/v1', done);
				});

				it('should return data v1', function () {
					expect(bodyReturned).to.eql([{
						dataVersion: 1,
						id: 1
					}, {
						dataVersion: 1,
						id: 2
					}]);
				});
			});

			describe('GET v2', function () {
				before(function (done) {
					get('entities/v2', done);
				});

				it('should return data v2', function () {
					expect(bodyReturned).to.eql([{
						dataVersion: 2,
						id: 1
					}, {
						dataVersion: 2,
						id: 2
					}]);
				});
			});

			describe('GET v3', function () {
				before(function (done) {
					get('entities/v3', done);
				});

				it('should return data v3', function () {
					expect(bodyReturned).to.eql([{
						dataVersion: 3,
						id: 1,
						fieldFromV3: true
					}, {
						dataVersion: 3,
						id: 2,
						fieldFromV3: true
					}]);
				});
			});
		});
	});

	describe('POST entitys', function () {
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