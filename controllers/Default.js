'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.apiElementContentPOST = function apiElementContentPOST (req, res, next) {
  var content = req.swagger.params['content'].value;
  var body = req.swagger.params['body'].value;
  Default.apiElementContentPOST(content,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiElementContentPUT = function apiElementContentPUT (req, res, next) {
  var content = req.swagger.params['content'].value;
  var body = req.swagger.params['body'].value;
  Default.apiElementContentPUT(content,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiElementDeleteIdsDELETE = function apiElementDeleteIdsDELETE (req, res, next) {
  var body = req.swagger.params['body'].value;
  Default.apiElementDeleteIdsDELETE(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.apiElementsGET = function apiElementsGET (req, res, next) {
  Default.apiElementsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.index = function index (req, res, next) {
  Default.index(res);
};

