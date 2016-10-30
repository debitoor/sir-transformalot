module.exports = {
	extends: '@debitoor/eslint-config-debitoor',
	env: {
		mocha: true
	},
	globals: {
		expect: true,
		bodyReturned: true,
		ensureApp: true
	}
};