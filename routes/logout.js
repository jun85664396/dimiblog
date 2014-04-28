var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  req.session.destroy(function(err) {
    // cannot access session here
  })
  res.redirect('../'); // go to root index
});

module.exports = router;