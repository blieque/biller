let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api', function(req, res){
    console.log('loggy')
    res.send('ayy pea eye');
});

//app.post('/api', function(req, res){
//    
//});

app.listen(3000, () => console.log('starting on 3000'));
