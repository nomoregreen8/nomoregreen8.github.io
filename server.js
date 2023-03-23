const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/main', (req, res)=> {
  res.sendFile(__dirname + '/public/myshorts.html');
});

function loadStory(filename, callback) {
  const filepath = path.join(__dirname, 'public', 'texts', filename);

  fs.readFile(filepath, 'utf8', (err, html) => {
    if (err) {
      console.error('Error:', err);
      return callback(err);
    }

    const dom = new JSDOM(html);
    const storyDiv = dom.window.document.querySelector('.story-text');

    if (storyDiv) {
      const storyHtml = storyDiv.innerHTML;
      return callback(null, storyHtml);
    } else {
      const error = new Error('Failed to find .story-text element in the loaded story');
      console.error('Error:', error);
      return callback(error);
    }
  });
}

app.get('/story/:id', (req, res) => {
  const storyId = req.params.id;
  
  let storyImage;
  let storyTitle;
  // For now, I'll just use the same 'murmurs_txt.html' file for every story.
  // You should update this to load the correct story based on the ID.
  let storyFilename;
  if (storyId === '1') {
    storyFilename = 'Evergreen.html';
    storyImage = '/thumbnails/fable.png';
    storyTitle = 'Evergreen';
  } else if (storyId === '2') {
    storyFilename = 'Murmurs of the Mind.html';
    storyImage = '/thumbnails/murmurs.jpg';
    storyTitle = 'Murmurs of the Mind';
  } 
  
  else if (storyId === '3'){
    storyFilename = 'In Full Bloom.html';
    storyImage = '/thumbnails/bloom.png';
    storyTitle = 'In Full Bloom';
  }
  
  else if(storyId === '4'){
    storyFilename = 'Dont Dream Lucid.html';
    storyImage = '/thumbnails/lucid.jpg';
    storyTitle = "Don't Dream Lucid";
  }
    else {
    // Return a 404 status code for an unknown story ID.
    return res.status(404).send('Story not found');
  }

  loadStory(storyFilename, (err, storyHtml) => {
    if (err) {
      res.status(500).send('Error loading story');
    } else {
      const renderedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/stories_page.css">
          <title>${storyFilename}</title>
        </head>
        <body>
          <header>
            <nav>
              <ul>
                <li><a href="/main">Home</a></li>
                <li><a href="/">Literature Reviews</a></li>
                <li><a href="/contact">About</a></li>
              </ul>
            </nav>
          </header>
          <main>
          <div class="container">
          <section class="img">
          <div class="img-container" style="background-image: url('${storyImage}');"></div> 
          </section>
              <section class="short-story">
                <h2 class = "title-text">${storyTitle}</h2> 
                <div style="position: relative;">
                <hr style="height: 1px; background-color: #b2bec3; border: none; width: 60%;">
              </div>
                <div id="story-text">${storyHtml}</div>
              </section>
            </div>
          </main>
        </body>
        </html>
      `;
      res.send(renderedHtml);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
