var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var http = require('http').createServer(app)
var cors = require('cors')
const io = require('socket.io')(http, { cors: { origin: '*'}});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (msg) => {
    console.log(msg);
    socket.broadcast.emit('message-broadcast', msg);
   });
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

http.listen(3000,()=>{
console.log(('listening'));
})

// var mongoDB = 'mongodb://127.0.0.1/my_database';
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(
//   ()=>{
//     console.log("connected  to db")
//     // app.listen(3000);
//     app.listen(3000)
//   }

// );
//Get the default connection
// var db = mongoose.connection;
// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// module.exports = app;


module.exports = app;
