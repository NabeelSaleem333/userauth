const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const setGlobalMiddleWares = app => {
app.use(cors());
app.use(logger("dev"));
app.use(express.json({ extended: false }));
};
module.exports = setGlobalMiddleWares;