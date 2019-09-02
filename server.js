const auth = require('./auth');
const version = '1.0.0';
var express = require('express'), app = express(), port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.listen(port, () => {
  auth.pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log("Cannot Connect to Database. Check Connection !")
      process.exit(1)
      return
    } else {
      console.log('Login API v.'+ version +' for Cloud Ace');
    }
  })
});

app.get('/', (request, response) => {
  response.json({ version: version, message: 'Login API'})
})

app.post('/login', auth.login)
app.post('/register', auth.register)
