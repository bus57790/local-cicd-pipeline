const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (like index.html) from the root directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
