
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , cradle = require('cradle')
  , db = new(cradle.Connection)().database('maze')
  , contentType = 'application/xml';

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/maze', function(req, res) {
  res.header('content-type', contentType);
  res.render('collection', {
    title: 'Maze+XML Hypermedia Example',
    site: 'http://localhost:3000/'
  });
});

app.get('/maze/:m', function (req, res) {
  var mz;
  mz = (req.params.m || 'none');
  
  db.get(mz, function(err, doc) {
    res.header('content-type', contentType);
    res.render('item', {
      site: 'http://localhost:3000/maze',
      maze: mz,
      debug: doc
    });
  });
});

app.get('/maze/:m/999', function(req, res) {
  var mz, cz;
  
  mz = (req.params.m || 'none');
  cz = (req.params.c || 'none');
  
  res.header('content-type', contentType);
  res.render('exit', {
    site: 'http://localhost:3000/maze',
    maze: mz,
    cell: cz,
    total: 0,
    side: 0,
    debug: '999',
    exit: 0
  });
});

app.get('/maze/:m/:c', function(req, res) {
  var mz, cz, x, ex, i, tot, sq;
  mz = (req.params.m || 'none');
  cz = (req.params.c || '0');
  
  db.get(mz, function(err, doc) {
    i = parseInt(cz.split(':')[0], 10);
    x = 'cell' + i;
    
    tot = Object.keys(doc.cells).length;
    ex = (i === tot-1 ? '1' : '0');
    sq = Math.sqrt(tot);
    
    res.header('content-type', contentType);
    res.render('cell' , {
      site: 'http://localhost:3000/maze',
      maze: mz,
      cell: cz,
      total: tot,
      side: sq,
      ix: [i-1, i + (sq*-1), i+1, i+sq],
      debug: doc.cells[x],
      exit: ex
    });
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
