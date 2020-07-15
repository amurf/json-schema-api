const axios = require('axios');

axios.post('http://localhost:3000/create', {})
     .then(response => console.log(response.data))
     .catch(error => console.log("Something went wrong..", error.response.data));

const shortid = 'P6qQwI1U6';
const data  = {
  'organisation.name': "i am string",
  'organisation.postcode': 3333,
};

axios.get(`http://localhost:3000/organisation/${ shortid }`, { params: { fields: ['name', 'something-else'] } })
     .then(response => console.log(response.data))
     .catch(error => console.log("Something went wrong..", error.response.data));

axios.post(`http://localhost:3000/save/${ shortid }`, data)
     .then(response => console.log(response.data))
     .catch(error => console.log("Something went wrong..", error.response.data));
