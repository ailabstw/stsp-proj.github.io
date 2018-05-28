const Ajv = require('ajv')
const ajv = new Ajv()
const db_schema = require('../schema/database')

module.exports = Valid
function Valid(data) {
  var validate = ajv.compile(db_schema)
  var valid = validate(data)
  return valid
}