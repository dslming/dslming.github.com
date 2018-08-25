var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use(express.static('public'));
app.use('/api', proxy({target: 'https://news-at.zhihu.com/', changeOrigin: true}));

    
app.get('/hello', function (req, res) {
  res.send("hello");
});

app.get('/api/4/news/latest', function (req, res) {
  res.send();
});

try{
    app.listen(8080, ()=>{
        console.log("running");
    });
}
catch(err){
    console.log(err);
}