const fs = require('fs');
const yaml = require('yaml');
const file = fs.readFileSync('./config/schema.yaml', 'utf8')


let data   = yaml.parse(file)
let tables = Object.keys(data);

module.exports = {
  data,
  tables,
};
