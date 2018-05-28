<<<<<<< HEAD
## 南科大數據資料庫首頁

使用 Jekyll 套件生成網頁
=======
# API for 南科計畫

## Getting start
``` bash= 
$ yarn
```


```bash= 
$ node app.js
```
    
```bash=
$ pm2 start ecosystem.config.js
$ pm2 log
```

## 分類
分成三類 API

1. user 相關
2. 上傳檔案用
3. 操作 DB 用

### user related API

- [x] 權限管理
- [x] POST: /v1/user 新增 user(normal user)
- [ ] PUT: /v1/user/me 修改 user(self)
- [ ] PUT: /v1/user/:userId 修改 user(root)
- [x] DELETE: /v1/user/me 刪除 user(self)
- [x] DELETE: /v1/user/:userId 刪除 user(root)
- [x] GET: /v1/user/me 查看 user(self)
- [ ] GET: /v1/user/userId 查看 user(by id)
- [x] GET: /v1/users 查看 users(root)
- [x] POST: /v1/signIn 登入 

### upload related API

- [x] POST: /v1/upload 上傳單一檔案
- [ ] POST: /v1/uploads 上傳多個檔案

### DB related API

- [x] GET: /v1/databases 查看所有 DB
- [x] GET: /v1/database/:db_id 查看單一 DB 
- [ ] DELETE: /v1/database/:db_id 刪除 DB
- [ ] DELETE: /v1/file/:file_id 刪除 file
- [ ] PUT: /v1/database/:db_id 修改 DB 相關資訊
- [ ] PUT: /v1/file/:file_id 修改單一 file comment
>>>>>>> a5cdcd1e5e672094f2d0ba9ab1b803b2d4e026d6
