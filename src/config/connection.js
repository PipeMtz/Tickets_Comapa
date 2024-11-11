import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
  connectionLimit: process.env.CONNECTION_LIMIT,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.MYSQL_DB,
  url: process.env.MYSQL_URL,
  port: process.env.DB_PORT
})

let db = {}

db.allUser = () =>{
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM Users', (err, users) => {
      if (err) {
        return reject(err)
      }
      return resolve(users)
    })
  })
}

db.getUserByEmail = (email) =>{
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM Users WHERE email =?', [email],(err, users) => {
      if (err) {
        return reject(err)
      }
      return resolve(users[0])
    })
  })
}

db.insertUser = (username, email, password, role) =>{
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO Users (username, password, email, role) VALUES (?, ?, ?, ?)', [username,password,email, role], (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result.insertId)
    })
  })
}

db.updateUser = (username, role, email, password, id) =>{
  return new Promise((resolve, reject)=>{
    pool.query('UPDATE User SET user_name = ?, role= ?, email= ?, password=? WHERE id = ?', [username, role, email, password, id], (error)=>{
      if(error){
        return reject(error)
      }
           
      return resolve()
    })
  })
}

db.deleteUser = (id) =>{
  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM User WHERE id = ?', [id], (error)=>{
      if(error){
        return reject(error)
      }
      return resolve(console.log('User deleted'))
    })
  })
}


export default db