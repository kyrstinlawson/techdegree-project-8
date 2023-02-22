const createError = require("http-errors");
var express = require('express');
var path = require('path');
const Sequelize = require("./models/index.js").sequelize;
var indexRouter = require("./routes/index");
const { create } = require("domain");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  await Sequelize.sync();
  try {
    await Sequelize.authenticate();
    console.log("Connection is successful");
  } catch (error) {
    console.log("Connection is unsuccessful");
  }
})();

app.use('/', indexRouter);

// catch 404 error and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
