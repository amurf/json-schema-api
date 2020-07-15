const fs = require('fs');
const yaml = require('yaml');

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const file = fs.readFileSync('./schema.yaml', 'utf8')
const data = yaml.parse(file)


// Add table prefix to all properties
const tables = Object.keys(data);
let properties = {};
for (table of tables) {
  for (field of data[table]) {
    const key = `${ table }.${ field.name }`;
    properties[key] = field;
  }
}


// JSON schema validator
let schema   = { properties };
let validate = ajv.compile(schema);

module.exports = validate;
