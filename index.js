const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  models = require('./models.js'),
  bodyParser = require('body-parser');

const Movies = models.movie;
const Users = models.user;
const Genres = models.genres;
const Directors = models.directors;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/[myFlix]', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const log = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

app.listen(8080, () => {
  console.log('Server listening on port 8080.');

  app.get('/', (req, res) => {
    res.send('Welcome to myflix!');
  });

  // get all movies
  app.get('/movies', async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // get movie by title
  app.get('/movies/:Title', async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // get movie by MongoDB id
  app.get('/movies/id/:id', async (req, res) => {
    await Movies.findOne({ _id: req.params.id })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // get movie(s) by genre
  app.get('/movies/genres/:genreName', (req, res) => {
    Movies.find({ Genre: req.params.genreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Get movie(s) by director
  app.get('/movies/directors/:director', (req, res) => {
    Movies.find({ Director: req.params.director })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  });

  // Get all users
  app.get('/users', async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.get('/users/name/:name', async (req, res) => {
    await Users.findOne({ Name: req.params.name })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  //Get User by Username
  app.get('/users/username/:username', async (req, res) => {
    await Users.findOne({ Username: req.params.username })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  //Get user by id
  app.get('/users/id/:id', async (req, res) => {
    await Users.findOne({ _id: req.params.id })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  //Add a user
  /*
{
  Name: String, (required)
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date (01/31/1995 format, required)
   - FavoriteMovies: Array - (This empty array will be automatically created)
   - _id: String - (This will also be automatically assigned by MongoDB)
} */
  app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users.create({
            Name: req.body.Name,
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  // Update User by Username
  /* We’ll expect JSON in this format
{
  Name: req.body.Name, (required)
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
  app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Name: req.body.Name,
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Add movie to user's favorites array
  app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  // Remove movie from user's favorites array

  app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });



  app.use(morgan('combined', { stream: log }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
  });
});
