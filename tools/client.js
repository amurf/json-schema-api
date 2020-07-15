const axios = require('axios');
const data  = {
  'organisation.name': 'not digitalx',
  'organisation.postcode': 3333,
};

axios.post('http://localhost:3000/save/1', data).then(response => {
  console.log(response.data);
});
