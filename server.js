const express = require('express');
const { v4: uuidv4 } = require('uuid');  // Import the uuid library
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); 

const urlDatabase = {}; // object to store URLs

app.post('/shorten', async(req, res) => { // Route to shorten the URL
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const { nanoid } = await import('nanoid');  // Dynamically import nanoid
  const shortCode = nanoid(6); // you can change the value inside the bracket acc to the length you want for your url

  urlDatabase[shortCode] = originalUrl;   // Store the original URL with the short code in the object

  const shortUrl = `http://localhost:${PORT}/${shortCode}`;  // Construct the shortened URL and send it as a response
  res.json({ shortUrl });
});

app.get('/:shortCode', (req, res) => {  // Route to redirect to the original URL using the short code
  const shortCode = req.params.shortCode;

  const originalUrl = urlDatabase[shortCode];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: 'Short URL not found' });
  }
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
