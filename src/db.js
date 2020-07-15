const pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

function save(table, data, session_id) {
  // postgres upsert, createOrUpdate
  return pg.raw(
    "INSERT INTO ?? as existing (session_id, data) VALUES (?, ?) ON CONFLICT (session_id) DO UPDATE SET data = existing.data || excluded.data;",
    [table, session_id, data]
  );
}

module.exports = {
  pg,
  save,
};
