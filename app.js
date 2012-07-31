var SiteQuery = require('sitequery').SiteQuery;


var crawlOpts = {url:'http://www.pec.coop/Home.aspx', maxDepth:1, delay:1000, maxCrawlTime: 100000}

var siteQuery = new SiteQuery(crawlOpts, 'a');

// ask for the observable sequence and subscribe for selected jQuery element(s)
siteQuery.toObservable().Subscribe(function(result) {
  console.log(result.sourceUrl, result.elem.attr('href'));
},
// on err
function(exn) {
  console.log('Something blowd up with exception:' + exn);
},
// on crawl complete
function() {
  console.log('SiteQuery complete');
  process.exit(0);
});
