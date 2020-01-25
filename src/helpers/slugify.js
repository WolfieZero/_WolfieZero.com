/**
 * Makes a string into a slug friendly string.
 *
 * @param {string} text String to make slug friendly
 * @returns {string}
 */
const slugify = (text = '') =>
  text
    .toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

module.exports = slugify;
