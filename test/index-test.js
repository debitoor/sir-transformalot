//var test = require('tape');
//var createPatches = require('./utils/create-patch');
//var sir = require('../index');
//
//test('transform upwards', function(t) {
//	var transform = sir(createPatches([
//		{
//			version: 'v2',
//			up: function(data, context) {
//				data.v2 = true;
//			}
//		},
//		{
//			version: 'v3',
//			up: function(data, context) {
//				data.v3 = true;
//			}
//		}
//	]));
//
//	t.plan(3);
//
//	transform.up('v1', function(err, transformer) {
//		t.deepEquals(transformer({}), {v2: true, v3: true});
//	});
//	transform.up('v2', function(err, transformer) {
//		t.deepEquals(transformer({}), {v3: true});
//	});
//	transform.up('v3', function(err, transformer) {
//		t.deepEquals(transformer({}), {});
//	});
//});
//
//test('transform downwards', function(t) {
//	var transform = sir(createPatches([
//		{
//			version: 'v2',
//			down: function(data, context) {
//				data.v2 = true;
//			}
//		},
//		{
//			version: 'v3',
//			down: function(data, context) {
//				data.v3 = true;
//			}
//		}
//	]));
//
//	t.plan(3);
//
//	transform.down('v3', function(err, transformer) {
//		t.deepEquals(transformer({}), {}, 'vest');
//	});
//	transform.down('v2', function(err, transformer) {
//		t.deepEquals(transformer({}), {v3: true}, 'fest');
//	});
//	transform.down('v1', function(err, transformer) {
//		t.deepEquals(transformer({}), {v3: true, v2: true}, 'test');
//	});
//});
//
//test('when dealing with no patches', function(t) {
//	var transform = sir([]);
//	transform.up('v1', function(err, transformer) {
//		t.deepEquals(transformer({foo: 'bar'}), {foo: 'bar'}, 'should return the input verbatim');
//		t.end();
//	});
//});
