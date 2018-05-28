const Ajv = require('ajv')
const ajv = new Ajv()
const usr_schema = require('../schema/user')

module.exports = Valid
function Valid(data) {
  var validate = ajv.compile(usr_schema)
  var valid = validate(data)
  if(!valid) console.error(valid.error)
  return valid
}