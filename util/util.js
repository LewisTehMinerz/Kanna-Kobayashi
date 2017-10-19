const { Collection } = require('discord.js');
const { promisify } = require('util');

/**
 * Static util class which has all sorts of handy methods
 * @static
 */
class Util {
	/**
	 * To title cases the passed string
	 * @param {string} string String to title case
	 * @returns {string}
	 * @static
	 */
	static titleCase(string) {
		const titleCased = [];
		for (const word of string.split(' ')) {
			titleCased.push(`${word[0].toUpperCase() + word.slice(1).toLowerCase()}`);
		}

		return titleCased.join(' ');
	}

	/**
	 * Parses flags from a string
	 * Duplicated entries will only return the content of the last one
	 * @param {string} input String to parse
	 * @param {boolean} lowercase Whether the keys should be lowercased automatically
	 * @returns {Collection<string, string>} Parsed flags, text before first flag is keyed under `--`
	 * @static
	 */
	static parseFlags(input, lowercase) {
		// Scary regex magic
		const regex = /--(\w+) (.+?(?=--|$))/g;
		const parsed = new Collection();

		if (!input.startsWith('--')) {
			if (input.includes('--')) {
				parsed.set('--', input.slice(0, input.indexOf('--')));
				input = input.slice(input.indexOf('--'));
			} else {
				parsed.set('--', input);
				return parsed;
			}
		}

		let match = null;
		while ((match = regex.exec(input)) !== null) {
			parsed.set(lowercase ? match[1].toLowerCase() : match[1], match[2].trim());
		}

		return parsed;
	}

	/**
	 * 
	 * @param {IterableIterator} iterator The iterator of the values to map
	 * @param {boolean} [random=fase] Whether to randomize the order
	 * @returns {string}
	 * @static
	 */
	static mapIterator(iterator, random = false) {
		const array = Array.from(iterator);

		if (random) {
			for (let i = array.length - 1; i > 0; --i) {
				const randomIndex = Math.floor(Math.random() * (i + 1));
				const randomValue = array[randomIndex];
				array[i] = array[randomIndex];
				array[randomIndex] = randomValue;
			}
		}

		let mapped = '';
		for (const value of array) {
			const stringValue = String(value);
			if (mapped.length + stringValue.length >= 1021) {
				mapped += '...';
				break;
			}
			mapped += ` ${stringValue}`;
		}

		return mapped;
	}

	/**
	 * Promisifies passed prototype's functions
	 * @param {Object} proto Prototype to promisify
	 * @return {Object} Promisified prototype
	 * @static
	 */
	static promisifyAll(proto) {
		for (const [key, fn] of Object.entries(proto)) {
			if (typeof fn !== 'function') continue;
			proto[`${key}Async`] = promisify(fn);
		}

		return proto;
	}

	// Straight copy from
	// https://github.com/Gawdl3y/discord.js-commando/blob/943e3c497de92db3b58670990fbb7f8dc64d42bd/src/util.js#L6-L17
	/**
	 * Paginates the passed array.
	 * @param {T[]} items The original items
	 * @param {number} page The requested page
	 * @param {number} pageLength The length of each page
	 * @returns {{ items: T[], page: number, maxPage: number, pageLength: number }}
	 */
	static paginate(items, page, pageLength = 10) {
		const maxPage = Math.ceil(items.length / pageLength);
		if (page < 1) page = 1;
		if (page > maxPage) page = maxPage;
		const startIndex = (page - 1) * pageLength;
		return {
			items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
			maxPage,
			page,
			pageLength
		};
	}
}

module.exports = Util;