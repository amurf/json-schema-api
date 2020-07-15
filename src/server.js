var fs = require('fs');
var yaml = require('yaml');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

const validate    = require("./json-schema-validation.js");
const validations = require("./validations.js");
const schema      = require("./schema.js");

const shortid = require('shortid');

// Webapp start
const fastify = require('fastify')({
  logger: true
})

// XXX: Can probably use the fastify built in schema validation here?
for (let table of schema.tables) {
  fastify.get(`/${ table }/:id`, async function(request, reply) {
    const { id } = await pg('session').select('id')
                                      .where({ shortid: request.params.id })
                                      .first() || {};

    if (!id) {
      reply.status(404).send(`Unknown ID ${ request.params.id }`);
    }

    let response = await pg(table).select('data').where({ id }).first();
    reply.send(response.data);
  });
}


fastify.post('/create', async function (request, reply) {
  const id = shortid.generate();
  let save = await pg('session').insert({ shortid: id });

  reply.send({ id });
});

// Save route. Handles calling schema validation, custom validators, saving all fields into correct tables.
fastify.post('/save/:id', async function (request, reply) {
  const { id } = await pg('session').select('id').where({ shortid: request.params.id }).first() || {};

  if (!id) {
    return reply.status(404).send(`Unknown ID ${ request.params.id }`);
  }

  const data  = request.body;
  const valid = validate(data);

  if (!valid) {
    return reply.status(400).send(validate.errorsText());
  }

  const errors = await validations.validate(data, id);
  if (errors.length > 0) {
    return reply.status(400).send(errors);
  }


  let tableData = {};
  for (let key of Object.keys(data)) {
    if (!data[key]) { continue; }

    let [table, field] = key.split('.');
    tableData[table] = { ...tableData[table], ...{ [field]: data[key] } };
  }


  // ^ Mappings between tables and fields calculated above. This saves each
  let saveData = Object.keys(tableData)
                       .map(tableName => save(tableName, tableData[tableName], id));
  await Promise.all(saveData);

  reply.send(tableData);
})

function save(table, data, session_id) {
  // postgres upsert, createOrUpdate
  return pg.raw(
    "INSERT INTO ?? as existing (session_id, data) VALUES (?, ?) ON CONFLICT (session_id) DO UPDATE SET data = existing.data || excluded.data;",
    [table, session_id, data]
  );
}

fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})


