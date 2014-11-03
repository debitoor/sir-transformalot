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
					get('entity/1/v1', done);
				});

				it('should return data v2', function () {
					expect(bodyReturned).to.eql({
						dataVersion: 2,
						id: 1
					});
				});
			});
		});

		describe('for plural cases', function() {
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
	});

	describe('POST entitys', function () {
		describe('POSTing correct old data to entity v1', function() {
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
		describe('POSTing incorrect old data to entity v1', function() {
			before(function (done) {
				post('entity/v1', {dataVersion: 2, id: 3}, 400, done);
			});

			it('should return object in format of v1', function () {
				expect(bodyReturned).to.eql({
					msg: 'data format mismatch'
				});
			});
		});

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
});