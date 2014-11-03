module.exports = function pluck(property) {
	return function(item) {
		return typeof item === 'object' && item[property];
	};
};
