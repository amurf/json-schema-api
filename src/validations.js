
function equals(a, b) {
  // only compare if both defined. this may not be what we want here.
  if (!a || !b) {
    return true;
  }

  return a === b;
}

const validators = {
  equals,
};

var pg = require('knex')({
    client: 'pg',
    connection: process.env.DB_URI,
    searchPath: ['knex', 'public'],
});

// XXX: yaml config?
const validations = {
  'organisation.name' : [
    // { 'func': 'equals', 'compareWith': 'service.name' },
    // { 'func': 'equals', 'compareWith': 'service.postcode' },
  ],
};


async function validate(data, session_id) {
  let validationFunctions   = [];
  let missingFields         = [];

  for (let key of Object.keys(data)) {
    if (validations[key]) {
      for (let validator of validations[key]) {
        // Build a list of missing fields, fetch all at once after,
        // then trigger functions to find errors.
        let compareWith = data[validator.compareWith];
        if (!compareWith) {
          missingFields.push(validator.compareWith);
        }

        validationFunctions.push({...validator, ...{field: key}});
      }
    }
  }

  if (missingFields.length > 0) {
    let missingValues = await getMissingValues(missingFields, session_id);
    data = {...data, ...missingValues};
  }

  let errors = validationFunctions.flatMap(validator => {
    let validatorFunc = validators[validator.func];
    if (validatorFunc(data[validator.field], data[validator.compareWith]) !== true) {
      return `${ validator.compareWith } is not the same as ${ validator.field }`;
    }

    return [];
  });

  return errors;
}

async function getMissingValues(missingFields, session_id) {

  // fetch missing fields. Builds a single query to fetch what we need from our tables.
  let tables = {};
  let fields = [];

  for (let missingField of missingFields) {
    let [table, field] = missingField.split('.');

    tables[table] = table;
    fields.push({ table, name: field });
  }

  const columnSelectors = fields.map(field => {
      let jsonField = `${ field.table }.data->'${ field.name }' as "${ field.table }.${ field.name }"`;
      return pg.raw(jsonField);
   });


  // Merge missing values back into main json object, so we can run validations
  let missingValues = await pg(tables).select(columnSelectors).where({ session_id }).first();
  return missingValues;
}


module.exports = {
  validate,
};
