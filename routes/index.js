var express = require('express');
var request = require('request');
const cheerio = require('cheerio')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  request.post(
    'http://www.erogamescape.org/~ap2/ero/toukei_kaiseki/sql_for_erogamer_form.php',
    { form: { 'sql': "SELECT * FROM brandlist where id < 10 order by id"} } ,
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(body);
          var hhtml = $('#query_result_main').find('tr').get(0);
          var dhtml = $('#query_result_main').find('tr').not(hhtml)
          var data = {
            header: [],
            items: [],
          }
          $(hhtml).find('th').map(function(i, el) {
            // this === el 
            data.header.push($(el).text())
          })

          $(dhtml).map(function(i, el) {
            var it = []
            $(el).find('td').map(function(j, e) {
              it.push($(e).text())
            })
            data.items.push(it)
          })
          res.send(JSON.stringify(data))
        }
    }
  );
  //res.render('index', { title: '使用了Express！' });
});

module.exports = router;
