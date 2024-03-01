const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const methodOverride = require('method-override');
const models = require('./models');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride());
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const Movies = models.movie;
const Users = models.user;
const Directors = models.director;
const Genres = models.genre;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:1234',
        'http://localhost:4200',
        'https://greg-allison-myflix.netlify.app',
        'https://thegregallison.github.io/myFlix-Angular-App',
      ];

      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          'The CORS policy for this application doesn’t allow access from origin ' +
          origin;
        return callback(new Error(message), false);
      }

      return callback(null, true);
    },
  })
);

// Sets the port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

// Mongo Local Database
// mongoose.connect('mongodb://127.0.0.1:27017/[myFlix]', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Mongo Cloud Database

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Writes all server activity to the log.txt file
const log = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});
app.use(morgan('combined', { stream: log }));

app.use(express.static(path.join(__dirname, 'public')));

// serves the docuemntation html page
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

// get all movies
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movies = await Movies.find()
        .populate('Genre')
        .populate('Director')
        .exec();
      res.status(200).json(movies);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

//Get all Genres
app.get(
  '/genres',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const genres = await Genres.find();
      res.status(200).json(genres);
    } catch (err) {
      console.error('Error fetching genres:', err);
      res.status(500).send('Internal Server Error');
    }
  }
);

//Get all Directors
app.get(
  '/directors',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const directors = await Directors.find();
      res.status(200).json(directors);
    } catch (err) {
      console.error('Error fetching directors:', err);
      res.status(500).send('Internal Server Error');
    }
  }
);

// get movie by title
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// get movie by MongoDB id
app.get(
  '/movies/id/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Movies.findOne({ _id: req.params.id })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// get movie(s) by genre
app.get(
  '/movies/genres/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find({ Genre: req.params.genreName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Get movie(s) by director
app.get(
  '/movies/directors/:director',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find({ Director: req.params.director })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  }
);

// Get all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// Not currently in use
// app.get(
//   '/users/name/:name',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     await Users.findOne({ Name: req.params.name })
//       .then((user) => {
//         res.status(200).json(user);
//       })
//       .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//       });
//   }
// );

//Get User by Username
app.get(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.username })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Get user by id
app.get(
  '/users/id/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOne({ _id: req.params.id })
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Add a user
/*
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date (DD/MM/YYYY format, required)
   - FavoriteMovies: Array - (This empty array will be automatically created)
   - _id: String - (This will also be automatically assigned by MongoDB)
} */
app.post(
  '/users',
  [
    check('Username', 'Username is required').isLength({ min: 1 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            BirthDate: req.body.BirthDate,
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
  }
);

// Update User by Username
/* We’ll expect JSON in this format:
    {
      Username: String, (required)
      Password: String, (required)
      Email: String, (required)
      Birthday: Date (DD/MM/YYYY format)
    }*/
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          BirthDate: req.body.BirthDate,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//DELETE user by username
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Unable to delete user');
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res
            .status(400)
            .send('User ' + req.params.Username + ' was not found.');
        } else {
          res
            .status(200)
            .send('User ' + req.params.Username + ' was successfully deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status.apply(500).send('Error: ' + err);
      });
  }
);

app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movie = await Movies.findById(req.params.MovieID);

      if (!movie) {
        return res.status(404).send('Movie not found');
      }

      // Explicitly populate movie details before pushing
      const populatedMovie = movie.toObject(); // Convert to plain JavaScript object
      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $push: { FavoriteMovies: populatedMovie },
        },
        { new: true }
      );

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    }
  }
);

// Remove movie from user's favorites array

app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

require('./auth')(router);
app.use('/', router);

// In case of server issue
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});
