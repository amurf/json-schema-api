const { pg, save } = require("./db.js");
const validations  = require("./validations.js");
const schema       = require("./schema.js");

const { validate, errorsText } = require("./json-schema-validation.js");
const { groupByTable }         = require("./util.js");

const shortid = require('shortid');
const fastify = require('fastify')({
  logger: true
});

for (let table of schema.tables) {
  fastify.route({
    method: 'GET',
    url: `/${ table }/:id`,
    schema: {
      querystring: {
        fields: { type: 'array' },
      },
      response: {
        200: {
          type: 'object',
          properties: schema.data[table],
        },
      },
    },
    handler: async function(request, reply) {
      const { id } = await pg('session').select('id')
                                        .where({ shortid: request.params.id })
                                        .first() || {};

      if (!id) {
        reply.status(404).send(`Unknown ID ${ request.params.id }`);
      }

      let response = await pg(table).select('data')
                                    .where({ session_id: id })
                                    .first();

      // if no row currently, just return empty ob
      if (!response.data) {
        reply.send({});
      }

      let requestedKeys = request.query.fields;
      const data = requestedKeys
                   ? requestedKeys.reduce((a, e) => (a[e] = response.data[e], a), {})
                   : response.data;


      reply.send(data);
    },
  });
}


fastify.post('/create', async function (request, reply) {
  const id = shortid.generate();
  let save = await pg('session').insert({ shortid: id });

  reply.send({ id });
});

// Save route. Handles calling schema validation, custom validators, saving all fields into correct tables.
fastify.post('/save/:id', async function (request, reply) {
  const { id } = await pg('session').select('id')
                                    .where({ shortid: request.params.id })
                                    .first() || {};

  if (!id) {
    return reply.status(404).send(`Unknown ID ${ request.params.id }`);
  }

  const data  = request.body;
  const valid = validate(data);
  if (!valid) {
    return reply.status(400).send([ errorsText(validate.errors) ]);
  }

  const errors = await validations.validate(data, id);
  if (errors.length > 0) {
    return reply.status(400).send(errors);
  }

  const tableData = groupByTable(data);
  let saveData    = Object.keys(tableData)
                          .map(tableName => save(tableName, tableData[tableName], id));
  await Promise.all(saveData);

  reply.send(tableData);
})

fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})


