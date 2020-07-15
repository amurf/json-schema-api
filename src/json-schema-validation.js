var fs = require('fs');
var yaml = require('yaml');

var Ajv = require('ajv');
var ajv = new Ajv({allErrors: true});

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
var schema   = { properties };
var validate = ajv.compile(schema);

module.exports = validate;
