//================
//
//
// # api v1
//
//
//================

const
express = require("express"),
store = require("./store.js"),
api = express.Router();

api.get("/articles", function(req, res){
    res.send(store.articles);
});

api.get("*", function(req, res){
    res.status(404).send('Not found');
});

module.exports = api;