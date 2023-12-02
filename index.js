const express = require('express'),
morgan = require('morgan'),
fs = require('fs'),
path = require('path');

const app = express();

const log = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
	flags: 'a'
});

app.listen(8080, () => {
    console.log('Server listening on port 8080.');

let movies = [
{
    'title': 'Iron Man',
    'director': 'John Favreau',
    'release-year': '2008'
},
{
    'title': 'The Incredible Hulk',
    'director': 'Louis Leterrier',
    'release-year': '2008'
},
{
    'title': 'Iron Man 2',
    'director': 'John Favreau',
    'release-year': '2010'
},
{
    'title': 'Thor',
    'director': 'Kenneth Branagh',
    'release-year': '2011'
},
{
    'title': 'Captain America: The First Avenger',
    'director': 'Joe Johnston',
    'release-year': '2011'
},
{
    'title': 'The Avengers',
    'director': 'Joss Whedon',
    'release-year': '2012'
},
{
    'title': 'Iron Man 3',
    'director': 'Shane Black',
    'release-year': '2013'
},
{
    'title': 'Thor: The Dark World',
    'director': 'Alan Taylor',
    'release-year': '2013'
},
{
    'title': 'Captain America and The Winter Soldier ',
    'director': 'Malcolm Spellman',
    'release-year': '2014'
},
{
    'title': 'Guardians of the Galaxy',
    'director': 'James Gunn',
    'release-year': '2014'
},
{
    'title': 'Avengers: Age of Ultron',
    'director': 'Joss Whedon',
    'release-year': '2015'
},
{
    'title': 'Ant-Man',
    'director': 'Peyton Reed',
    'release-year': '2015'
},
{
    'title': 'Captain America: Civil War',
    'director': 'Anthony Russo',
    'release-year': '2016'
},
{
    'title': 'Doctor Strange',
    'director': 'Scott Derrickson',
    'release-year': '2016'
},
{
    'title': 'Guardians of the Galaxy Vol. 2',
    'director': 'James Gunn',
    'release-year': '2017'
},
{
    'title': 'Spider-Man: Homecoming',
    'director': 'Jon Watts',
    'release-year': '2017'
},
{
    'title': 'Thor: Ragnarok',
    'director': 'Taika Waititi',
    'release-year': '2017'
},
{
    'title': 'Black Panther',
    'director': 'Ryan Coogler',
    'release-year': '2018'
},
{
    'title': 'Avengers: Infinity War',
    'director': 'Anthony Russo',
    'release-year': '2018'
},
{
    'title': 'Ant-Man and the Wasp',
    'director': 'Peyton Reed',
    'release-year': '2018'
},
{
    'title': 'Captain Marvel',
    'director': 'Anna Boden',
    'release-year': '2019'
},
{
    'title': 'Avengers: Endgame',
    'director': 'Anthony Russo',
    'release-year': '2017'
},
]

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/', (req, res,) => {
    res.send('Welcome to MyFlix!')
});

app.use(morgan("combined", { stream: log }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send('Server Error');
});
});