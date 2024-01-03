const express = require('express');
const cors = require('cors');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const models = require('./models.js');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const app = express();
const passport = require('passport');
require('./passport.js');
let auth = require('./auth.js')(app);
require("./auth")(router);

const Movies = models.movie;
const Users = models.user;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/", router);

// mongoose.connect('mongodb://127.0.0.1:27017/[myFlix]', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);

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
    res.send('Welcome to myflix!');
  });

  // get all movies
  app.get(
    '/movies',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      await Movies.find()
        .then((movies) => {
          res.status(201).json(movies);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
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

  app.get(
    '/users/name/:name',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      await Users.findOne({ Name: req.params.name })
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    }
  );

  //Get User by Username
  app.get(
    '/users/username/:username',
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
  Name: String, (required)
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
      check('Username', 'Username is required').isLength({ min: 5 }),
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
              Name: req.body.Name,
              Username: req.body.Username,
              Password: hashedPassword,
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
    }
  );

  // Update User by Username
  /* We’ll expect JSON in this format:
    {
      Name: req.body.Name, (required)
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
              .send(
                'User ' + req.params.Username + ' was successfully deleted.'
              );
          }
        })
        .catch((err) => {
          console.error(err);
          res.status.apply(500).send('Error: ' + err);
        });
    }
  );

  // Add movie to user's favorites array
  app.post(
    '/users/:Username/movies/:MovieID',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
      await Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $push: { FavoriteMovies: req.params.MovieID },
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

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
  });
});
