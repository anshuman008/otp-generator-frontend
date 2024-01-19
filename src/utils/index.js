
/**
 * Returns whether a value is null.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isNull(val) {

	return val === null;
}

/**
 * Returns whether a value is defined.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isDefined(val) {

	return val !== undefined;
}

/**
 * Returns whether a value is undefined.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isUndefined(val) {

	return val === undefined;
}

/**
 * Returns whether a value is an object.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isObject(val) {

	return typeof val === 'object' && val !== null;
}

/**
 * Returns whether a value is a function.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isFunction(val) {

	return typeof val === 'function';
}

/**
 * Returns whether a value is a number.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isNumber(val) {

	return typeof val === 'number';
}

/**
 * Returns whether a value is a string.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isString(val) {

	return typeof val === 'string';
}

/**
 * Returns whether a value is an empty string.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isEmptyString(val) {

	return isString(val) && val.length === 0;
}

/**
 * Returns whether a value is a non-empty string.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isNonEmptyString(val) {

	return isString(val) && val.length !== 0;
}

/**
 * Returns whether a value is an array.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isArray(val) {

	return Object.prototype.toString.call(val) === '[object Array]';
}

/**
 * Returns whether a value is not empty array.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isNotEmptyArray(val) {

	return isArray(val) && val.length !== 0;
}

/**
 * Returns whether a value is contains atleast one field.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isNotEmptyObject(val) {

	return isObject(val) && isNotEmptyArray(Object.keys(val));
}

export const isEmptyObj = object => {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			return false;
		}
	}
};

/**
 * Returns whether a string is JSON or not.
 *
 * @param  {*} val
 * @return {Boolean}
 */
export function isJsonString(val) {
	try {
		JSON.parse(val);
	} catch (e) {
		return false;
	}
	return true;
}

/**
 * Deep checks two objects are return true if both objects are eqaul
 *
 * @param   {Object}    Object1     The first object.
 * @param   {Object} 	Object2   	The second object.
 * @return 	{Boolean}
 */
export function areObjectsEqual(obj1, obj2) {
	if (isObject(obj1) && isObject(obj2)) {
		for (let p in obj1) {
			if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

			switch (typeof (obj1[p])) {
				case 'object':
					if (!areObjectsEqual(obj1[p], obj2[p])) return false;
					break;
				case 'function':
					if (typeof (obj2[p]) == 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
					break;
				default:
					if (obj1[p] !== obj2[p]) return false;
			}
		}

		for (let p in obj2) {
			if (typeof (obj1[p]) == 'undefined') return false;
		}
		return true;
	} else if (isNull(obj1) && isNull(obj2)) {
		return true;
	} else if (isUndefined(obj1) && isUndefined(obj2)) {
		return true;
	} else {
		return false;
	}
}

export function isStringNumeric(str) {
	if (typeof str != 'string') return false;
	if (str === '.') return true;
	return !isNaN(str) && !isNaN(parseFloat(str));
}

export function capitalizeFirstLetter(string) {
	const finalSentence = string.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
	// return string.charAt(0).toUpperCase() + string.slice(1);
	return finalSentence;
}
