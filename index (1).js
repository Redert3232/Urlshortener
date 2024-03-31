require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const app = express();
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


const originalUrls = [];
const shortenedUrls = [];

app.post('/api/shorturl', (req, res) =>{
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url)


 if(!url.includes('https://') && !url.includes('http://')){


  return res.json({error: 'invalid url'})
 }

  


  if (foundIndex < 0){
    originalUrls.push(url);
    shortenedUrls.push(shortenedUrls.length);

    return res.json({
      original_url: url,
      short_url: shortenedUrls.length - 1
    })
  }


  res.json({
    original_url: url,
    short_url: shortenedUrls[foundIndex]
  })
  
})

app.get('/api/shorturl/:shorturl', (req, res) =>{

  const shortUrl= parseInt(req.params.shorturl);
  const foundIndex = shortenedUrls.indexOf(shortUrl);

  if(foundIndex < 0 ){
    return res.json({'error': 'Not short URL found for the given input'})
  }

  res.redirect(originalUrls[foundIndex]);
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
