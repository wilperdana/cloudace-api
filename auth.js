const bcrypt = require('bcrypt');
const Pool = require('pg').Pool

const SELECT_USER = 'SELECT * FROM users WHERE username = $1'
const SELECT_USER_WITH_PASSWORD = SELECT_USER + ' AND password = $2'
const INSERT_NEW_USER = 'INSERT INTO users(username, password, created_at, updated_at) VALUES($1, $2, $3, $4)'

const API_SALT = process.env.SALT || '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'
const API_BEARER = process.env.BEARER || 'Y2xvdWRlYWNlYXBp'
const DB_HOST = process.env.DB_HOST || "127.0.0.1"
const DB_USER = process.env.DB_USER || "root"
const DB_PASSWORD = process.env.DB_PASSWORD || ""
const DB_PORT = process.env.DB_PORT || "5432"
const DB_CONN = process.env.DB_CONN || 10
const DB_NAME = process.env.DB_NAME

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  max: DB_CONN,
  port: DB_PORT
})

const register = (request, response) => {
  const { username, password } = request.body

  if (authorizationHead != "Bearer " + API_BEARER) {
    response.status(401).json({success: false, message: 'Token not found !'})
    return
  }

  if (!username || !password) {
    response.status(401).json({success: false, message: 'Username and Password needed to register !' })
    return
  }

  pool.query(SELECT_USER, [username], (err, res) => {
    if (err) {
      console.log(err)
      response.status(500)
      return
    }

    if (res.rowCount != 0) {
      return response.status(200).json({success: false, message: 'User ' + username + ' has been created before !'})
    } else {
      bcrypt.hash(password, API_SALT, function (err, password) {
        pool.query(INSERT_NEW_USER, [username, password, new Date(), new Date()], (err, res) => {
          if (err) {
            console.log(err)
            response.status(500)
            return
          }

          return response.status(200).json({success: true, message: 'New User created !'})
        })
      })
    }
  })
}

const login = (request, response) => {
  const { username, password } = request.body
  const authorizationHead = request.headers['authorization']

  if (authorizationHead != "Bearer " + API_BEARER) {
    response.status(401).json({success: false, message: 'Token not found !'})
    return
  }

  if (!username || !password) {
    response.status(401).json({success: false, message: 'Username and Password needed to login !' })
    return
  }

  bcrypt.hash(password, API_SALT, function (err, password) {
    pool.query(SELECT_USER_WITH_PASSWORD, [username, password], (err, res) => {
      if (err) {
        console.log(err)
        response.status(500)
        return
      }

      if (res.rowCount == 1) {
        response.status(200).json({success: true, message: 'Authenticated !'})
      } else {
        response.status(401).json({success: false, message: 'Wrong Username or Password'})
      }
    })
  })
}

module.exports = {
  login,
  register,
  pool
}
