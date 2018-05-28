// BDD
const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const assert = require('assert')
const config = require('../config')
const usr_schema = require('../schema/user_self_check')

chai.use(require('chai-json-schema'))
const api = supertest(config.HOST)
let APItoken
let ROOTtoken
let deleted_usr

const phone = "0911111111"
const password = "wjfowmdj"


before(() => {
  it('Register should success', (done) => {
    api.post('/v1/users')
      .set('Accept', 'application/json')
      .send({
        name: 'test',
        phone: phone,
        password: password,
        group: 'test'
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        if (res.status !== 200) {
          return done(res.body)
        }
        deleted_usr = res.body.id
        done()
      })
  })
  
  it('SignIn as normal user', (done) => {
    api.post('/v1/signIn')
    .set('Accept', 'application/json')
    .send({
      'phone': phone,
      'password': password
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      APItoken = res.body.access_token
      done()
    })
  })
})

describe('#Normal User', () => {
  it('Can checkout self info', (done) => {
    api.get('/v1/users/me')
    .set('Authorization', APItoken)
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      expect(res.body).to.be.jsonSchema(usr_schema)
      done()
    })
  })

  it('Can delete self(soft)', (done) => {
    api.delete('/v1/users/me')
    .set('Authorization', APItoken)
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      else done()
    })
  })

  it("Can't checkout all users", (done) => {
    api.get('/v1/users/all')
    .set('Authorization', APItoken)
    .expect(403)
    .end((err, res) => {
      if(err) done(err)
      done()
    })
  })
})

describe('#Root User', () => {
  it('SignIn as root user should success', (done) => {
    api.post('/v1/signIn')
    .set('Accept', 'application/json')
    .send({
      phone: config.root_phone,
      password: config.root_password
    })
    .expect(200)
    .end((err, res) => {
      if(err) done(err)
      ROOTtoken = res.body.access_token
      done()
    })
  })

  it('Can checkout all users', (done) => {
    api.get('/v1/users/all')
    .set('Authorization', ROOTtoken)
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      done()
    })
  })

  after('Can really delete users', (done) => {
    api.delete('/v1/users/real_delete')
    .set('Authorization', ROOTtoken)
    .send({ id: deleted_usr })
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      done()
    })
  })
})