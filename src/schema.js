const fs = require('fs');
const yaml = require('yaml');
const file = fs.readFileSync('./schema.yaml', 'utf8')


let data   = yaml.parse(file)
let tables = Object.keys(data);

function fieldsForTable(table) {
  return data[table];
}

module.exports = {
  data,
  tables,
  fieldsForTable,
};
