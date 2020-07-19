var fs = require('fs');
var yaml = require('yaml');

var pg = require('knex')({
  client: 'pg',
  connection: process.env.DB_URI,
  searchPath: ['knex', 'public'],
});

const { data } = require('../src/schema.js');

let exportPromises = [];
for (let table of Object.keys(data)) {
  let columns = Object.keys(data[table]).map(columnName => {
    return { name: columnName, ...data[table][columnName] }
  });
  const exportTableName = `${ table }_export`

  exportPromises.push(doExport(table, exportTableName, columns));
}

Promise.all(exportPromises)
       .then(ok => console.log("Databases exported"))
       .catch(error => console.log("Something went wrong", error))
       .finally(_ => pg.destroy());

async function doExport(tableName, exportTableName, columns) {
  await createTable(tableName, exportTableName, columns);
  await exportTable(tableName, exportTableName, columns);
}

async function exportTable(tableName, exportTableName, columns) {
  const columnNames     = columns.map(column => column.name);
  const columnSelectors = columns.map(column => {
    let jsonRead =  `data->>'${ column.name }'`;
    if (column.type == 'number') {
      jsonRead =  `(data->>'${ column.name }')::int`;
    }
    let jsonField = `${ jsonRead } as ${ column.name }`;
    return pg.raw(jsonField);
  });

  let subquery = pg(tableName).select(columnSelectors);
  let insert   = await pg(
    pg.raw("?? (" + columnNames.map(_ => '??').join(',') + ")",
      [exportTableName, ...columnNames])
  ).insert(subquery)
}

async function createTable(tableName, exportTableName, columns) {
  const exists = await pg.schema.hasTable(exportTableName);
  if (exists) {
    return;
  }

  let response = await pg.schema.createTable(exportTableName, table => {
    table.increments();
    columns.map(column => {
      if (column.type == 'number') {
        table.integer(column.name);
      } else {
        table[column.type](column.name);
      }
    });
  });

  return response;
}
