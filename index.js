const express = require('express');
const simplify = require('./routes/simplify');

const app = express();
app.use(express.json());

app.use('/api/simplify', simplify);

app.listen(3005, () => {
  console.log('Server listening on port 3005');
});