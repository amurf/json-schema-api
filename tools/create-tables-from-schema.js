var fs = require('fs');
var yaml = require('yaml');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

const file = fs.readFileSync('./schema.yaml', 'utf8');
const data = yaml.parse(file);


let createPromises = Object.keys(data).map(tableName => createTable(tableName));

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
    table.timestamps(false,true);
    table.jsonb('data');
  });

  return response;
}
