module.exports = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "permission": {
      "type": "string",
      "enum": [ "root", "admin", "normal" ]
    },
    "phone": {
      "type": "string",
      "minLength": 10,
      "maxLength": 10
    },
    "group": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [ "name", "permission", "phone", "group" ]
}