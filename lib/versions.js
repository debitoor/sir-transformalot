module.exports.removeExpired = function(versions) {
	var now = new Date();
	return versions.filter(function(patch) {
		return !patch.expires || patch.expires > now;
	});
};

module.exports.sort = function(versions) {
	return versions.sort(function(a, b) {
		return a.version > b.version;
	});
};

module.exports.range = function(versions, from, to) {
	var getRange;

	if (from < to) {
		return versions.filter(function(patch) {
			return patch.version > from && patch.version <= to;
		});
	}
	else if (to < from) {
		return versions.filter(function(patch) {
			return patch.version <= from && patch.version > to;
		}).reverse();
	}
	else {
		return [];
	}
};
