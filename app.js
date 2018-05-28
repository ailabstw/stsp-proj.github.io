const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const spawn = require('child_process').spawn
const jwt = require('jsonwebtoken')
const usr_valid = require('./validators/user')
const config = require('./config')
const multer = require('multer')
const path = require('path')
const generator = require('./generator/generate_post')
const axios = require('axios')
// const router = express.Router()

var flag = false

// --------------------- config ---------------------

// mariadb
var db = mysql.createConnection(config.mysql)
db.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('db connected as id ' + db.threadId);
})

// Client files
app.use(express.static(__dirname + '/client/dist'));

// bodyParser
app.use(bodyParser.json({
  limit: '1mb'
}))
app.use(bodyParser.urlencoded({
  extended: false
}))


// jwt
app.set('jwt_token_secret', 'asdasdasd')

// message
function Msg(msg, code) {
  return {
    "message": msg,
    "code": code
  }
}

// add header
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// decoder
app.use(function (req, res, next) {
  console.log(req.url, req.method)
  // 不需 token 就可使用
  if (req.url == '/v1/users' ||
    req.url == '/v1/signIn' ||
    req.method == 'OPTIONS') {
    console.log('success')
    next()
    // 需要權限為 admin, root
  } else if (req.url == '/v1/uploads' ||
    req.url == 'v1/upload') {
    jwt.verify(req.headers['authorization'], app.get('jwt_token_secret'), function (err, decoded) {
      req.decoded = decoded
      if (!req.decoded || req.decoded.permission == 'normal') {
        console.log('permission denied')
        res.status(403).json(Msg("Permission denied", 403))
      } else {
        next()
      }
    })
    // 需要權限為 root
  } else if (req.url == '/v1/users/all' ||
    req.url == '/v1/users/real_delete') {
    jwt.verify(req.headers['authorization'], app.get('jwt_token_secret'), function (err, decoded) {
      req.decoded = decoded
      if (!req.decoded || req.decoded.permission != 'root') {
        console.log('permission denied')
        res.status(403).json(Msg("Permission denied", 403))
      } else {
        next()
      }
    })
    // 需要權限為 normal, admin, root
  } else {
    jwt.verify(req.headers['authorization'], app.get('jwt_token_secret'), function (err, decoded) {
      req.decoded = decoded
      if (!req.decoded) {
        console.log(req.headers)
        console.log('permission denied')
        res.status(403).json(Msg("Permission denied", 403))
      } else {
        next()
      }
    })
  }
})

// multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({
  storage: storage
}).single('file')
var uploads = multer({
  storage: storage
}).array('files', 10)

//  --------------------- API ---------------------
//  ---------------- membership -------------------

// webhook
// app.post('/webhook', function(req, res) {
//   if (req.headers['x-gitlab-token'] == 'asdasdasd') {
//      res.status(200).json({})
//      spawn('./rebuild')
//   }
// })


/**
 * Get Users Info
 * 
 * @permission
 *  - root: can see all users
 *  - admin: permission denied
 *  - normal: permission denied
 *  - 尚未登入: permission denied
 * 
 */

app.get('/v1/users/all', function (req, res) {
  if (!req.decoded || req.decoded.permission != 'root') {
    res.status(403).json(Msg("Permission Denied!", 403))
    // console.log(req.deocded)
  } else {
    db.query('SELECT * FROM users', function (err, rows, field) {
      if (err) throw err
      // console.log(rows)
      res.status(200).json(rows)
    })
  }
})

app.get('/v1/users/me', function (req, res) {
  res.status(200).json({
    'id': req.decoded.id,
    'name': req.decoded.name,
    'phone': req.decoded.phone,
    'group': req.decoded.group,
    'permission': req.decoded.permission
  })
})

/**
 * Get Single User Info
 * 
 * @permission
 *  - 使用者登入後可看見自己的完整 info
 *  - permission {root} 可查看任何人的完整 info
 *  - 有登入的使用者可查看任何人的部分 info
 *  - 未登入者: permission denied
 * 
 */

// app.get('/v1/users/:userId', function (req, res) {
//   user_id = req.params.userId
//   if (req.decoded.id == user_id ||
//     req.decoded.permission == 'root') {
//     db.query('SELECT id, name, phone, permission, password FROM users WHERE ?', {
//       'id': user_id
//     }, function (err, rows, field) {
//       if (err) throw err
//       res.json(rows)
//     })
//   } else {
//     db.query('SELECT id, name, phone FROM users WHERE ?', {
//       'id': user_id
//     }, function (err, rows, field) {
//       if (err) throw err
//       res.json(rows)
//     })
//   }
// })

/**
 * Create User
 * 
 * @body {json} 
 *  - {string} name
 *  - {string} cellphone
 *  - {string} password
 *  - {string} permission
 * 
 * @rows[0] {object}
 *  - {int} insertId (= user id)
 * 
 */

app.post('/v1/users', function (req, res) {
  req.body.permission = 'normal'
  if (usr_valid(req.body)) {
    db.query('INSERT INTO users SET ?', {
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
      permission: 'normal',
      group: req.body.group
    }, function (err, rows, fields) {
      if (err) {
        if (err.code == 'ER_DUP_ENTRY') {
          res.status(401).json(Msg("phone has been used", 401))
        } else {
          console.error(err)
          res.status(401).json(Msg("Unknown error", 401))
        }
      } else {
        console.log(rows.insertId)
        // res.status(200).json(Msg("Created!", 200))
        res.status(200).json({
          message: "Created!",
          id: rows.insertId,
          status: 200
        })
      }
    })
  } else {
    res.status(401).json(Msg("Invalid input", 401))
  }
})

// 待修改(加上權限)
app.delete('/v1/users/me', function (req, res) {
  user_id = req.decoded.id
  db.query('UPDATE users SET deleted=1 WHERE id = ?', [user_id], function (err, rows, field) {
    if (err) {
      console.error(err)
      res.status(401).json(Msg("Unknown error", 401))
    } else {
      res.status(200).json(Msg("Success deleted", 200))
    }
  })
})

// app.delete('/v1/users/:userId', function (req, res) {
//   if (decoded.permission == 'root') {
//     user_id = req.params.userId
//     db.query('UPDATE users SET deleted=1 WHERE id = ?', [user_id], function (err, rows, field) {
//       if (err) {
//         console.error(err)
//         res.status(401).json(Msg("Unknown error", 401))
//       } else {
//         res.status(200).json(Msg("Success deleted", 200))
//       }
//     })
//   }
// })

app.delete('/v1/users/real_delete', function (req, res) {
  id = req.body.id
  db.query('DELETE FROM users WHERE id = ?', [id], function (err, rows, field) {
    if (err) {
      console.error(err)
      res.status(401).json(Msg("Unknown error", 401))
    } else {
      res.status(200).json(Msg("Success deleted", 200))
    }
  })
})

/**
 * Login
 * 
 * @body {json}
 *  - {string} phone
 *  - {string} password
 * 
 * @token {object}
 *  - {int} id
 *  - {string} name
 *  - {string} phone
 *  - {string} permission
 * 
 */

// TODO:
// signOut API
app.post('/v1/signIn', function (req, res) {
  usr = req.body
  usr_phone = req.body.phone
  db.query('SELECT * FROM users WHERE phone = ?', [usr_phone], function (err, rows, fields) {
    if (err) {
      console.error(err)
      res.status(401).json(Msg("Unknown error", 401))
    } else if (rows.length === 0) {
      res.status(401).json(Msg("User not exist", 401))
    } else {
      // console.log(rows[0].password)
      if (usr.password == rows[0].password) {
        var token = jwt.sign({
          id: rows[0].id,
          name: rows[0].name,
          phone: rows[0].phone,
          group: rows[0].group,
          permission: rows[0].permission
        }, app.get('jwt_token_secret'), {
          expiresIn: '1h'
        }, function (err, token) {
          console.log(token)
          res.status(200).json({
            access_token: token
          })
        })
      } else {
        res.status(401).json(Msg("Wrong password", 401))
      }
    }
  })
})
//  --------------------- API ---------------------
//  ----------------- uploading -------------------

// TODO:
// 區分各公司上傳 API
// 更新檔案 comment
// date: unsign int (for sorting)
// 
// FIXME:
// upload 方面 API 先暫停製作
// app.post('/v1/uploads', function (req, res) {
//   uploads(req, res, function (err) {
//     if (err) {
//       console.error(err)
//       res.status(400).json(Msg("Unknown error", 400))
//       return
//     } else if (!req.file) {
//       console.error(req.file)
//       res.status(400).json(Msg("Empty file", 400))
//     } else {
//       for (var i = 0; i < req.files.length; i++) {
//         file_name = req.files[i].filename
//         db.query('INSERT INTO files SET ?', {
//           name: file_name,
//           extname: path.extname(file_name),
//           comment: req.body.comment[i],
//           size: req.files[i].size,
//           path: req.files[i].path
//         }, function (err, rows, fields) {
//           if (err) {
//             if (err.code == 'ER_DUP_ENTRY') {
//               // 重複的檔案處理
//               res.status(200).json(Msg("Seccess upload", 200))
//               // res.status(401).json(Msg("file name has been used", 401)) 
//             } else {
//               console.error(err)
//               res.status(401).json(Msg("Unknown error", 401))
//             }
//           }
//         })
//       }
//       console.log(req.file)
//       res.status(200).json(Msg("Seccess upload", 200))
//     }
//   })
// })

// app.post('/v1/upload', function (req, res) {
//   upload(req, res, function (err) {
//     if (err) {
//       console.error(err)
//       res.status(400).json(Msg("Unknown error", 400))
//     } else if (!req.file) {
//       console.error(req.file)
//       res.status(400).json(Msg("Empty file", 400))
//     } else {
//       file_name = req.file.originalname
//       db.query('INSERT INTO files SET ?', {
//         name: file_name,
//         extname: path.extname(file_name),
//         comment: req.body.comment,
//         size: req.file.size,
//         path: req.file.path,
//         db_id: 1
//       }, function (err, rows, fields) {
//         if (err) {
//           if (err.code == 'ER_DUP_ENTRY') {
//             // res.status(200).json(Msg("Seccess upload", 200))
//             res.status(401).json(Msg("file name has been used", 401))
//           } else {
//             console.error(err)
//             res.status(401).json(Msg("Unknown error", 401))
//           }
//         }
//         console.log(req.file)
//         res.status(200).json(Msg("Seccess upload", 200))
//       })
//     }
//   })
// })

// app.put('/v1/comment', function (req, res) {
//   db.query('UPDATE files SET comment=? WHERE id= ?', [req.body.comment, req.body.id], function (err, rows, field) {
//     if (err) {
//       console.error(err)
//       res.status(500).json(Msg("Unknown wrong", 500))
//     } else {
//       console.log(rows)
//       res.status(200).json(rows)
//     }
//   })
// })

//  --------------------- API ---------------------
//  ------------------ databases ------------------

app.get('/v1/databases', function (req, res) {
  db.query('SELECT * FROM ai_databases', function (err, rows, field) {
    if (err) {
      console.error(err)
      res.status(500).json(Msg("Unknown Wrong", 500))
    } else {
      // console.log(rows)
      // rows.forEach((e, i) => {
      //   delete rows[i].password
      // })
      res.status(200).json(rows)
    }
  })
})

app.post('/v1/databases', function (req, res) {
  db.query('INSERT INTO ai_databases SET ?', req.body.db_info, function (err, rows, field) {
    if (err) {
      console.error(err)
      res.status(500).json(Msg("Unknown Wrong", 500))
    } else {
      res.status(200).json({
        message: 'Database Created!',
        id: req.body.id,
        status: 200
      })
    }
  })
})

// TODO:
// 思考要怎麼包修改 DB 的資料(info)
app.put('/v1/databases', function (req, res) {
  delete req.body.db_info.date
  var query = db.query('UPDATE ai_databases SET ? WHERE `id`= ?', [req.body.db_info, req.body.id],
    function (err, rows, field) {
      if (err) {
        console.error(err)
        res.status(500).json(Msg("Unknown wrong", 500))
      } else {
        console.log(rows)
        res.status(200).json(rows)
      }
    })
  console.log(query.sql)
})

// 前端若是使用 axios call API
// DELETE 這個方法傳遞的參數會放在 params(符合 RESTful API)
// 但是我有在前端特別放到 body(data) 裡面, 所以可以接得到
app.delete('/v1/databases', function (req, res) {
  db.query('DELETE FROM ai_databases WHERE id= ?', [req.body.id], function (err, rows, field) {
    if (err) {
      console.error(err)
      res.status(500).json(Msg("Unknown wrong", 500))
    } else {
      console.log(rows)
      res.status(200).json(Msg("deleted DB!", 200))
    }
  })
})

app.get('/v1/generate', function (req, res) {
  console.log(flag)
  if(flag) {
    res.status(400).json(Msg("too frequency", 400))
  } else {
    flag = true
    db.query('SELECT * FROM ai_databases', function (err, rows, field) {
      if (err) {
        console.error(err)
        res.status(500).json(Msg("Unknown Wrong", 500))
      } else {
        rows.forEach((e, i) => {
          delete rows[i].password
        })
        generator.generate_post(rows)
        // 更新 github page
        axios.get(config.jekyllhook)
          .then(function (response) {
            console.log(response.data)
            res.status(200).json(response.data)
          })
          .catch(function (error) {
            console.log(error)
          })
      }
      flag = false
    })
  }
  
})

app.listen(3000, function () {
  console.log('app is listen at 3000')
})