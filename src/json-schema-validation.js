const fs = require('fs');
const yaml = require('yaml');

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

// Add table prefix to all properties
const { data, tables } = require('./schema.js');
let properties = {};
for (table of tables) {
  for (field of Object.keys(data[table])) {
    const key = `${ table }.${ field }`;
    properties[key] = data[table][field];
  }
}


// JSON schema validator
let schema   = { properties };
let validate = ajv.compile(schema);

module.exports = {
  validate,
  errorsText: ajv.errorsText,
};
