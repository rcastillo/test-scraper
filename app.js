var SiteQuery = require('sitequery').SiteQuery;
var sqlite3 = require('sqlite3').verbose();

function createDatabase() {
    var db = new sqlite3.Database('./linksdb');
    
    db.run("CREATE TABLE links (url TEXT, timestamp INTEGER)");
    return db;
}

var db = createDatabase();

var crawlOpts = {url:'http://www.pec.coop/Home.aspx', maxDepth:1, delay:1000, maxCrawlTime: 100000}

var siteQuery = new SiteQuery(crawlOpts, 'a');

// ask for the observable sequence and subscribe for selected jQuery element(s)
siteQuery.toObservable().Subscribe(function(result) {
  console.log(result.sourceUrl, result.elem.attr('href'));
  // positional
  var stmt = db.prepare("INSERT INTO links VALUES (?, ?)");
  var date = new Date();
  stmt.run(result.sourceUrl + result.elem.attr('href'), (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear()  + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
  stmt.finalize();
},

// on err
function(exn) {
  console.log('Something blowd up with exception:' + exn);
},
// on crawl complete
function() {
  console.log('SiteQuery complete');
  db.close();
  //process.exit(0);
})
;
// Webstack here

/**
 * Module dependencies.
 */
var express = require('express');

var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'one ring to rule them all'}));
  app.use(require('stylus').middleware({src: __dirname + '/public'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// routes
//app.get('/links', function(req, res, next){
//  res.render('test', {title:'Test Page'});
//});

app.get('/', function(req, res, next){
  res.render('index');
});

app.listen(3000);

console.log('server is listening');