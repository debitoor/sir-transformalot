var test = require('tape');
var get = require('./testUtil').get;

test('get endpoint v1', function(t) {
	t.plan(1);
	get('/endpoint/v1', function(err, resp, body) {
		t.false(err, 'should not have error');
		t.equals(resp.statusCode, 200, 'statusCode of response');
		t.equals(body, 'This is response from endpoint v1', 'check get endpoint v1');
	});
});
