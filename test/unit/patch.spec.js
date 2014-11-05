var patch = require('../../lib/patch');
var createPatches = require('./../utils/create-patch');

describe('lib/patch', function () {
	var transforms, context, err;

	describe('initializing transform', function(t) {
		before(function (done) {
			transforms = createPatches([
				{initialize: function(context, done){ done(); }}
			]);
			patch.initializeAll(transforms, function(_err, _context) {
				err = _err;
				context = _context;
				done();
			});
		});

		it('should not return err', function () {
			expect(err).to.be.not.ok;
		});

		it('should return expected context', function () {
			expect(context).to.eql({});
		});


	});

	describe('initializing transform returning errors', function(t) {

		before(function (done) {
			transforms = createPatches([
				{initialize: function(context, done){ done(new Error('ouch')); }}
			]);
			patch.initializeAll(transforms, function(_err, _context) {
				err = _err;
				context = _context;
				done();
			});
		});

		it('should return an Error', function () {
			expect(err).to.be.an.instanceof(Error);
		});

		it('should not return a context object', function () {
			expect(context).to.eql(undefined);
		});
	});
});
