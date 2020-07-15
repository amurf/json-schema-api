var fs = require('fs');
var yaml = require('yaml');

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

const validate    = require("./src/json-schema-validation.js");
const validations = require("./src/validations.js");
const schema      = require("./src/schema.js");

// Webapp start
const fastify = require('fastify')({
  logger: true
})


// Setup getter routes. These just return the data object.
// XXX: Can add schema validation to this i reckon?
// auth ?

for (let table of schema.tables) {
  fastify.get(`/${ table }/:id`, async function(request, reply) {
    let response = await pg(table).select('data').where({id: request.params.id}).first();
    reply.send(response.data);
  });
}

// Save route. Handles calling schema validation, custom validators, saving all fields into correct tables.
fastify.post('/save/:id', async function (request, reply) {
  const data  = request.body;
  const valid = validate(data);

  if (!valid) {
    return reply.send(validate.errors);
  }

  const errors = await validations.validate(request);
  if (errors.length > 0) {
    return reply.send(errors);
  }


  let tableData = {};
  for (let key of Object.keys(data)) {
    if (!data[key]) { continue; }

    let [table, field] = key.split('.');
    tableData[table] = { ...tableData[table], ...{ [field]: data[key] } };
  }


  console.log("Saving!");
  // ^ Mappings between tables and fields calculated above. This saves each
  let saveData = Object.keys(tableData)
                       .map(tableName => save(tableName, tableData[tableName], request.params.id));
  await Promise.all(saveData);

  reply.send(tableData);
})

function save(table, data, id) {
  return pg(table).update({
    data: pg.raw('data || ?', JSON.stringify(data)),
  }).where({id: id});
}

// Run the server
fastify.listen(3000, '0.0.0.0', function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
