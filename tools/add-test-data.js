var faker = require('faker');
var fs = require('fs');
var yaml = require('yaml');
var shortid = require('shortid');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

const { data } = require('../src/schema.js');

let insertPromises = [];

for (const table of Object.keys(data)) {
  let columns = data[table];

  let json = columns.reduce((accum, column) => {
    if (column.type === 'string') {
      accum[column.name] = faker.random.word();
    } else {
    // All the modules are inconsistent with max/maximum, going to need to normalize
    // this somewhere. Sigh.
      accum[column.name] = faker.random[column.type]({ max: column.maximum });
    }
    return accum;
  }, {});


  insertPromises.push(insert(table, json));
}

Promise.all(insertPromises)
       .then(ok => console.log("Randomized data inserted"))
       .catch(error => console.log("Something went wrong", error))
       .finally(_ => pg.destroy());


async function insert(tableName, json) {
  const exists = await pg.schema.hasTable(tableName);
  if (!exists) {
    return;
  }

  let [ session_id ] = await pg('session').insert({ shortid: shortid.generate() }).returning('id');
  console.log(session_id);
  let response = await pg(tableName).insert({ session_id: session_id, data: JSON.stringify(json) });

  return response;
}
