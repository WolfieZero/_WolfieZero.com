const inclusiveLangPlugin = require('@11ty/eleventy-plugin-inclusive-language');
const htmlmin = require('html-minifier');
const dayjs = require('dayjs');

module.exports = eleventyConfig => {
  const now = +new Date();
  const publishedFilter = single => single.date <= now && !single.data.draft;

  eleventyConfig.addCollection('blog', collection => [
    ...collection.getFilteredByGlob('./blog/**/*.md').filter(publishedFilter),
  ]);

  eleventyConfig.addFilter('readableDate', date =>
    dayjs(date).format('YYYY MMM DD')
  );

  eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath.endsWith('.html')) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy('content/assets');
  eleventyConfig.addPassthroughCopy('admin');

  // eleventyConfig.addPlugin(inclusiveLangPlugin);

  return {
    dir: {
      input: 'content',
      output: 'public',
      layouts: '_layouts',
    },
    passthroughFileCopy: true,
  };
};
