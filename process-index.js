const cheerio = require('cheerio')
const fs = require('fs');
const _ = require('lodash');
const indexFilePath = 'dist/browser/index.html';

// read our index file
fs.readFile(indexFilePath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  // load html into cheerio so we can manipulate DOM
  const $ = cheerio.load(data)

  var baseHref = $('base').attr('href');

  if (baseHref !== '/') {
    const links = $('link');
    links.each((index, _element) => {
      const element = $(_element);
      if (element.attr('href') && element.attr('href').match(/^\/assets\//) || element.attr('href').match(/^assets\//)) {
        const currentHref = element.attr('href').replace(/^\//, '');
        element.attr('href', baseHref + currentHref);
      }
    });

    const metas = $('meta');
    links.each((index, _element) => {
      const element = $(_element);
      if (element.attr('content') && element.attr('content').match(/^\/assets\//) || element.attr('href').match(/^assets\//)) {
        const currentHref = element.attr('content').replace(/^\//, '');
        element.attr('content', baseHref + currentHref);
      }
    });
  }

  // now write that file back
  fs.writeFile(indexFilePath, $.html(), function (err) {
    if (err) return console.log(err);
  });
});