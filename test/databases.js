// BDD
const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const assert = require('assert')
const config = require('../config')
const db_schema = require('../schema/database') 

chai.use(require('chai-json-schema'))
const api = supertest(config.HOST)
let APItoken
const id = 'TEST99999'
const new_id = 'AFTER8888'

const db_info = {
  id: id,
  name: 'test',
  password: 'aaaaaaaaaaa',
  classify: '標竿型',
  group: 'Taiwan AI Labs',
  data_classify: '無人載具',
  data_comment: 'this is testing',
  data_type: '.test',
  website: 'http://ailabs.tw'
}

// TODO:
// Deep copy?
const new_db_info = {
  id: new_id,
  name: 'test',
  password: 'aaaaaaaaaaa',
  classify: '標竿型',
  group: 'Taiwan AI Labs',
  data_classify: '無人載具',
  data_comment: 'this is testing',
  data_type: '.test, .jpg',
  website: 'http://ailabs.tw'
}

before(() => {
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
      APItoken = res.body.access_token
      done()
    })
  })
})

describe('#Databases', () => {
  it('Can be call by users', (done) => {
    api.get('/v1/databases')
    .set('Authorization', APItoken)
    .expect(200)
    .end((err, res) => {
      if(err) done(err)
      let data = res.body
      data.forEach(function(e) { 
        expect(e).to.be.jsonSchema(db_schema)
      })
      done()
    })
  })
  
  it('Can be inserted by users', (done) => {
    api.post('/v1/databases')
    .set('Authorization', APItoken)
    .send({db_info: db_info})
    .expect(200)
    .end((err, res) => {
      if (err) done(err)
      done()
    })
  })

  it('Can be modified by users', (done) => {
    api.put('/v1/databases')
    .set('Authorization', APItoken)
    .send({
      id: id,
      db_info: new_db_info
    })
    .expect(200)
    .end((err, res) => {
      if(err) done(err)
      done()
    })
  })  

  after(('Can be deleted by users', (done) => {
    api.delete('/v1/databases')
    .set('Authorization', APItoken)
    .send({ id: new_id })
    .expect(200)
    .end((err, res) => {
      if(err) done(err)
      done()
    })
  }))
})

