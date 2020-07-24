const fs = require('fs');
const yaml = require('yaml');
const file = fs.readFileSync(process.env.SCHEMA_FILE || './config/schema.yaml', 'utf8')


let data   = yaml.parse(file)
let tables = Object.keys(data);

let properties = {};
for (table of tables) {
    properties = {...properties, ...propertiesForTable(table) };
}

function propertiesForTable(tableName) {
  let properties = {};

  for (field of Object.keys(data[tableName])) {
    const key = `${ tableName }.${ field }`;
    properties[key] = data[tableName][field];
  }

  return properties;
}

module.exports = {
  data,
  tables,
  properties,
  propertiesForTable,
};
