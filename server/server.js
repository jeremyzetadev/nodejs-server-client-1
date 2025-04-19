import express from 'express';
import cors from 'cors';
const port = process.env.API_PORT || 4000;
const app = express();
import * as API from './middleware/apikeys.js';
import { users, cheeses } from './data.js';

const usersTEST = [
  {
    name: 'Name',
    age: 31,
  },
  {
    name: 'Name2',
    age: 40
  }
]

app.get('/usersTest', (req, res) => {
  res.json(usersTEST);
})


app.get('/', (req, res) => {
  res.status(200).send({ data: { message: 'Everything is just cheesy.' } });
})

app.post('/api/register', (req, res) => {
  let email = req.email.body;
  let user = API.createUser(email, req);
  console.log(users);
  res.status(201).send({ data: user });
})

app.get('/api/cheese', API.validateKey, (req, res) => {
  let today = new Date().toISOString().split('T')[0];
  console.log(today);
  res.status(200).send({
    data: cheeses,
  });
});

app.post('/api/cheese', API.validateKey, (req, res) => {
  let cheese = {
    _id: Date.now(),
    name: req.body.cheese,
  };
  cheeses.push(cheese);
  res.status(201).send({
    data: cheese,
  });
});

app.put('/api/cheese/:id', API.validateKey, (req, res) => {
  res.status(200).send({
    data: {
      message: `Cheese ${req.params.id} updated.`,
    },
  });
});
app.delete('/api/cheese/:id', API.validateKey, (req, res) => {
  res.status(200).send({
    data: {
      message: `Cheese ${req.params.id} deleted.`,
    },
  });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000")
})