const fs = require('fs');
const yaml = require('yaml');

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

// Add table prefix to all properties
const { properties } = require('./schema.js');

// JSON schema validator
let schema   = { properties };
let validate = ajv.compile(schema);

module.exports = {
  validate,
  errorsText: ajv.errorsText,
};
