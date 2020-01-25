const fs = require('fs');

const styleDirectory = __dirname + '/../../scss';

const categories = [
  {
    id: 3,
    name: 'Objects',
    single: 'Object',
    directoryName: '3.object',
  },
  {
    id: 4,
    name: 'Components',
    single: 'Component',
    directoryName: '4.components',
  },
  {
    id: 5,
    name: 'Views',
    single: 'View',
    directoryName: '5.views',
  },
  {
    id: 6,
    name: 'Utilties',
    single: 'Utilty',
    directoryName: '6.utilities',
  },
]

const category = process.argv[2];
const title = process.argv[3];

/**
 * Makes a string into a slug friendly string.
 *
 * @param {string} text String to make slug friendly
 * @returns {string}
 */
const slugify = (text = '') =>
  text.toLowerCase()
    .replace(/^\s+|\s+$/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

/**
 * Gives us additional info on the category.
 *
 * @type {Object}
 */
const categoryInfo = (needle => {
  if (Number.isInteger(parseInt(needle))) {
    return categories.find(value => value.id == needle ? value : null) || {};
  }
  return categories.find(value => (value.name === needle || value.single === needle) ? value : null) || {};
})(category);

/**
 * Slugified title.
 *
 * @type {String}
 */
const titleSlug = slugify(title);

/**
 * Slugified category.
 *
 * @type {String}
 */
const categorySlug = slugify(categoryInfo.name);

/**
 * Slugified category single.
 *
 * @type {String}
 */
const categorySingleSlug = slugify(categoryInfo.single);

/**
 * Full path to the category.
 *
 * @type {String}
 */
const categoryPath = `${styleDirectory}/${categoryInfo.directoryName}`;

/**
 * Filename.
 *
 * @type {String}
 */
const file = `_${categorySingleSlug}.${titleSlug}.scss`;

/**
 * Full path to the file.
 *
 * @type {String}
 */
const filePath = `${categoryPath}/${file}`;

/**
 * Contents of the file.
 *
 * @type {String}
 */
const fileContents = fs.readFileSync(`${__dirname}/component.scss.stub`, { encoding: 'utf8' })
  .replace(/{{block}}/g, title)
  .replace(/{{blockSlug}}/g, titleSlug)
  .replace(/{{category}}/g, category);

/**
 * Index file of the category.
 *
 * @type {String}
 */
const indexFile = `__${categorySlug}.scss`;

/**
 * Index file path of the category.
 *
 * @type {String}
 */
const indexFilePath = `${styleDirectory}/${categoryInfo.directoryName}/__${categorySlug}.scss`;

// =============================================================================

console.info(`Making "${title}" within "${category}"`);

const localFileResolve = `./src/scss/${categoryInfo.directoryName}/${file}`;

try {
  if (!fs.existsSync(categoryPath)) {
    throw Error('Category does not exist',);
  }

  if (fs.existsSync(filePath)) {
    throw Error('File exists');
  }

  if (fs.writeFileSync(filePath, fileContents)) {
    throw Error(`Cannot create file ${localFileResolve}`)
  }
} catch (error) {
  console.error(error.message);
  return;
}

console.info(`File created: ${localFileResolve}`);

// =============================================================================

console.info(``);

// =============================================================================

console.info(`Updating index file`);

const localIndexResolve = `./src/scss/${categoryInfo.directoryName}/${indexFile}`;

try {
  let indexFileContents = fs.readFileSync(indexFilePath, { encoding: 'utf8' })
  fs.writeFileSync(indexFilePath, indexFileContents + `@import '${file.slice(1)}';\r`);
} catch(error) {
  console.error(`Cannot update ${localIndexResolve}`);
}

console.info(`File updated: ${localIndexResolve}`);

// TODO: Add some sorting here to keep files alphabetical
