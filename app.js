const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const API_HOST = "https://api.clickup.com"
const DEFAULT_TEST_TOKEN = "49179401_5fcc1e725251cab5b50c49d39817af3563dc74cb4773a51a6e457690e666bbcc"

app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/obsidian', (req, res) => {
  const code = req.query.code || "";
  // res.redirect('obsidian://plugin?code=' + code)

  const data = {
    code: code
    // message: 'Welcome to my website!'
  };
  res.render('index', data);


})
app.use('/proxy', (req, res) => {
  const method = req.method;
  // Get the request path
  const path = req.path;
  const params = req.query;
  const url = `${API_HOST}${path}`
  const token = req.headers.authorization

  var request = require('request');
  var options = {
    method,
    url,
    'headers': {
      'Content-Type': 'application/json'
    }
  };
  if (params && Object.keys(params).length > 0) options.qs = params
  if (req.body && Object.keys(req.body).length > 0) options.body = req.body;
  if (token) options.headers['Authorization'] = token

  console.log(options)
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.type('json')
    res.send(response.body)
  });

})

// not found response
app.get("*",(req,res) => {
  res.render('404');
})


// Start the server
const port = 4010; // Set the desired port number
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});


