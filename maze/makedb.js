var cradle = require('cradle');

cradle.setup({

host: 'localhost',
cache: true, 
raw: false
});

var c = new (cradle.Connection)('localhost', 5984);

var db = c.database('maze'); //db.create();

db.exists(function (err, exists) {

if (err) {
  console.log('error', err);
} else if (exists) {
  console.log('the force is with you.');
} else {
  console.log('database does not exists.');
  db.create();
  /* populate design documents */
}

});

db.remove('maze', '1-60c3c61927af11e294af198c89b50ee1', function(err, res){
    
});

db.save('five-by-five', {
    'cells' : {
        'cell0':[1,1,1,0],
        'cell1':[1,1,1,0],
        'cell2':[1,1,0,0],
        'cell3':[0,1,0,1],
        'cell4':[0,1,1,0],
        'cell5':[1,0,1,0],
        'cell6':[1,0,0,1],
        'cell7':[0,0,1,0],
        'cell8':[1,1,0,0],
        'cell9':[0,0,1,1],
        'cell10':[1,0,0,1],
        'cell11':[0,1,1,0],
        'cell12':[1,0,1,1],
        'cell13':[1,0,0,1],
        'cell14':[0,1,1,0],
        'cell15':[1,1,1,0],
        'cell16':[1,0,1,0],
        'cell17':[1,1,0,0],
        'cell18':[0,1,0,1],
        'cell19':[0,0,1,0],
        'cell20':[1,0,0,1],
        'cell21':[0,0,0,1],
        'cell22':[0,0,1,1],
        'cell23':[1,1,0,1],
        'cell24':[0,0,1,1]
        }
    }, function (err, res) {

  if (err) {
      // Handle error
  } else {
      // Handle success
  }
});