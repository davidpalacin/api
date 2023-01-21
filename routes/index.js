var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, _next) {
  res.json({
    message: "nothing here",
    success: false
  });
});

module.exports = router;
