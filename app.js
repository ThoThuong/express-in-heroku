var createError = require('http-errors');
var express = require('express'), redirect = require("express-redirect");
const dotenv = require('dotenv');
const connectDB = require('./server/database/connect');
dotenv.config({ path: './config.env' });
connectDB();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var cors = require('cors')
var app = express();
app.use(cors())
redirect(app);






//config for req
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'pug');
// app.use(logger('tiny'));
app.use(logger('dev'));
// app.use(express.json({ limit: '50mb' }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '150mb' }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(upload.array());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





// router
const authenRouter = require('./routes/authen');
app.use('/authen', authenRouter);
const indexRouter = require('./routes/index');
app.use('/', indexRouter);
const testRouter = require('./routes/test')
app.use('/test', testRouter)
// const usersRouter = require('./routes/users');
// app.use('/users', usersRouter);



// catch err
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({ mess: err });
  res.render('error');
});


module.exports = app;
// ooooo