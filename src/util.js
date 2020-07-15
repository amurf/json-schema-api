function groupByTable(data) {
  let grouped = {};

  for (let key of Object.keys(data)) {
    if (!data[key]) { continue; }

    let [table, field] = key.split('.');
    grouped[table] = { ...grouped[table], ...{ [field]: data[key] } };
  }

  return grouped;
}


module.exports = {
  groupByTable,
};
