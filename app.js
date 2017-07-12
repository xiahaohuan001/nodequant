var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var NodeQuantApp=require("./NodeQuantApp");

var app = express();


var NodeQuantApplication = new NodeQuantApp(app);
global.Application = NodeQuantApplication;

//主引擎启动,界面可以手动下单
global.Application.MainEngine.Start();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function NodeQuantAppExit(){
    console.log('NodeQuant Exit');
    global.Application.MainEngine.Stop();
};


process.on('uncaughtException',function (err) {
    //打印出错误
    console.log(err);
    //打印出错误的调用栈方便调试
    console.log(err.stack);
});

process.on('exit',function (code) {
    console.log(code);
});

process.on('SIGINT', function() {
    NodeQuantAppExit();
    setInterval(function () {
        console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
        process.exit();
    },2*1000);
});

module.exports = app;
