var fs = require('fs');
var yaml = require('yaml');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

const { data } = require('../src/schema.js');

for (let table of Object.keys(data)) {
  let columns = data[table];

  pg.schema.createTable(table + "_export", function (table) {
    table.increments();
    columns.map(column => {
      if (column.type == 'number') {
        table.integer(column.name);
      } else {
        table[column.type](column.name);
      }
    });
  }).then(row => {

    const columnNames = columns.map(column => column.name);
    const columnSelectors = columns.map(column => {
      let jsonRead =  `data->>'${ column.name }'`; 
      if (column.type == 'number') {
        jsonRead =  `(data->>'${ column.name }')::int`;
      }
      let jsonField = `${ jsonRead } as ${ column.name }`;
      return pg.raw(jsonField);
    });
    let subquery = pg(table).select(columnSelectors);

    let insert = pg(
      pg.raw("?? (" + columnNames.map(_ => '??').join(',') + ")",
        [table + "_export", ...columnNames])
    ).insert(subquery).then(row => console.log(row));
  });
}
