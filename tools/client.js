const axios = require('axios');

axios.post('http://localhost:3000/create', {})
     .then(response => console.log(response.data))
     .catch(error => console.log("Something went wrong..", error.response.data));

const shortid = 'eQ2fuX_jQt';
const data  = {
  'organisation.name': 3500,
  'organisation.postcode': 3333,
};

axios.post(`http://localhost:3000/save/${ shortid }`, data)
     .then(response => console.log(response.data))
     .catch(error => console.log("Something went wrong..", error.response.data));
