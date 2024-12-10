const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (_req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running at \x1b[33mhttp://localhost:${port}/\x1b[39m`);
});
