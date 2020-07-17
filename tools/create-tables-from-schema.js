var fs = require('fs');
var yaml = require('yaml');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

const { data, tables } = require('../src/schema.js');


let createPromises = Object.keys(data).map(createTable);

Promise.all(createPromises)
       .then(resolves => console.log("All tables created successfully"))
       .catch(error   => console.log("Something went wrong..", error))
       .finally(_     => pg.destroy());


async function createTable(tableName) {
  const exists = await pg.schema.hasTable(tableName);
  if (exists) {
    return;
  }

  let response = await pg.schema.createTable(tableName, table => {
    table.increments();

    table.integer('session_id');
    table.jsonb('data');
    table.timestamps(false,true);

    table.unique('session_id'); // ??
    table.foreign('session_id').references('session.id');
  });

  return response;
}
