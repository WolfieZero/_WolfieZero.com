const fs = require('fs');
const { slugify } = require('../../helpers');

const styleDirectory = __dirname + '/../../scss';

const categories = [
  {
    id: 3,
    name: 'Posts',
    single: 'Post',
    directoryName: '3.object',
  },
];

const title = process.argv[2];

/**
 * Slugified title.
 *
 * @type {String}
 */
const titleSlug = slugify(title);

const id = 0;

/**
 * Filename.
 *
 * @type {String}
 */
const file = `${id}.${titleSlug}.md`;

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
const fileContents = fs
  .readFileSync(`${__dirname}/single.md.stub`, { encoding: 'utf8' })
  .replace(/{{block}}/g, title);

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
    throw Error('Category does not exist');
  }

  if (fs.existsSync(filePath)) {
    throw Error('File exists');
  }

  if (fs.writeFileSync(filePath, fileContents)) {
    throw Error(`Cannot create file ${localFileResolve}`);
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
  let indexFileContents = fs.readFileSync(indexFilePath, { encoding: 'utf8' });
  fs.writeFileSync(
    indexFilePath,
    indexFileContents + `@import '${file.slice(1)}';\r`
  );
} catch (error) {
  console.error(`Cannot update ${localIndexResolve}`);
}

console.info(`File updated: ${localIndexResolve}`);

// TODO: Add some sorting here to keep files alphabetical
