const fs = require('fs');
const yaml = require('yaml');
const file = fs.readFileSync('./schema.yaml', 'utf8')


let data   = yaml.parse(file)
let tables = Object.keys(data);

function fieldsForTable(table) {
  return data[table];
}


// This formats for fastify. WIP still figuring out the formatting, so multiple
// functions for now
function propertiesForTable(table) {
  const fields = fieldsForTable(table);
  return fields.reduce((a, field) => (a[field.name] = {type: field.type}, a), {});
}

module.exports = {
  data,
  tables,
  fieldsForTable,
  propertiesForTable,
};
