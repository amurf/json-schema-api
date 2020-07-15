// This should be a knex migration, but this is easier for now.

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});


pg.schema.createTable('session', table => {
    table.increments();
    table.string('shortid', 14); // max length of shortid = 14
    table.timestamps(false,true);
}).then(resolves => console.log("session table created successfully"))
  .catch(error   => console.log("Something went wrong..", error))
  .finally(_     => pg.destroy());

