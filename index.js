const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path');

const app = express();

let movies = [
    {
        'id': '1',
        'title': 'Iron Man',
        'director': 'Jon Favreau',
        'releaseYear': '2008',
        'genre': 'action',
        'phase': '1'
    },
    {
        'id': '2',
        'title': 'The Incredible Hulk',
        'director': 'Louis Leterrier',
        'releaseYear': '2008',
        'genre': 'action',
        'phase': '1'
    },
    {
        'id': '3',
        'title': 'Iron Man 2',
        'director': 'Jon Favreau',
        'releaseYear': '2010',
        'genre': 'action',
        'phase': '1'
    },
    {
        'id': '4',
        'title': 'Thor',
        'director': 'Kenneth Branagh',
        'releaseYear': '2011',
        'genre': 'action',
        'phase': '1'
    },
    {
        'id': '5',
        'title': 'Captain America: The First Avenger',
        'director': 'Joe Johnston',
        'releaseYear': '2011',
        'genre': 'action',
        'phase': '1'
    },
    {
        'id': '6',
        'title': 'The Avengers',
        'director': 'Joss Whedon',
        'releaseYear': '2012',
        'genre': 'action',
        'phase': '1'
    },
    {
        'id': '7',
        'title': 'Iron Man 3',
        'director': 'Shane Black',
        'releaseYear': '2013',
        'genre': 'action',
        'phase': '2'
    },
    {
        'id': '8',
        'title': 'Thor: The Dark World',
        'director': 'Alan Taylor',
        'releaseYear': '2013',
        'genre': 'action',
        'phase': '2'
    },
    {
        'id': '9',
        'title': 'Captain America and The Winter Soldier ',
        'director': 'Malcolm Spellman',
        'releaseYear': '2014',
        'genre': 'action',
        'phase': '2'
    },
    {
        'id': '10',
        'title': 'Guardians of the Galaxy',
        'director': 'James Gunn',
        'releaseYear': '2014',
        'genre': 'action',
        'phase': '2'
    },
    {
        'id': '11',
        'title': 'Avengers: Age of Ultron',
        'director': 'Joss Whedon',
        'releaseYear': '2015',
        'genre': 'action',
        'phase': '2'
    },
    {
        'id': '12',
        'title': 'Ant-Man',
        'director': 'Peyton Reed',
        'releaseYear': '2015',
        'genre': 'action',
        'phase': '2'
    },
    {
        'id': '13',
        'title': 'Captain America: Civil War',
        'director': 'Anthony Russo',
        'releaseYear': '2016',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '14',
        'title': 'Doctor Strange',
        'director': 'Scott Derrickson',
        'releaseYear': '2016',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '15',
        'title': 'Guardians of the Galaxy Vol. 2',
        'director': 'James Gunn',
        'releaseYear': '2017',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '16',
        'title': 'Spider-Man: Homecoming',
        'director': 'Jon Watts',
        'releaseYear': '2017',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '17',
        'title': 'Thor: Ragnarok',
        'director': 'Taika Waititi',
        'releaseYear': '2017',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '18',
        'title': 'Black Panther',
        'director': 'Ryan Coogler',
        'releaseYear': '2018',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '19',
        'title': 'Avengers: Infinity War',
        'director': 'Anthony Russo',
        'releaseYear': '2018',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '20',
        'title': 'Ant-Man and the Wasp',
        'director': 'Peyton Reed',
        'releaseYear': '2018',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '21',
        'title': 'Captain Marvel',
        'director': 'Anna Boden',
        'releaseYear': '2019',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '22',
        'title': 'Avengers: Endgame',
        'director': 'Anthony Russo',
        'releaseYear': '2019',
        'genre': 'action',
        'phase': '3'
    },
    {
        'id': '23',
        'title': 'Spider-Man: Far From Home',
        'director': 'Jon Watts',
        'releaseYear': '2019',
        'genre': 'action',
        'phase': '3'
    },
    ]

const log = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

app.listen(8080, () => {
  console.log('Server listening on port 8080.');

  app.get('/movies', (req, res) => {
    res.json(movies);
    res.status(200).send('Movies array');
  });

  app.get('/movies/:title', (req, res) => {
    res.json(
      movies.find((movie) => {
        return movie.title === req.params.title;
      })
    );
  });

  app.get('/movies/id/:id', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.id === req.params.id;
      })
    );
  });

  app.get('/movies/genres/:genre', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.genre === req.params.genre;
      })
    );
  });

  app.get('/movies/releaseYear/:releaseYear', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.releaseYear === req.params.releaseYear;
      })
    );
  });

  app.get('/movies/phases/:phase', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.phase === req.params.phase;
      })
    );
  });

  app.get('/movies/directors/:director', (req, res) => {
    res.json(
      movies.filter((movie) => {
        return movie.director === req.params.director;
      })
    );
  });


  app.use(morgan('combined', { stream: log }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
  });
});
