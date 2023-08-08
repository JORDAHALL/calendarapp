const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Task = require('./models/tasks');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://127.0.0.1:27017/calendar');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.render('tasks/index', { tasks });
});

app.get('/tasks/new', (req, res) => {
    res.render('tasks/new')
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body.task);
    await task.save();
    res.redirect('/tasks')
});

app.listen(3000, () => {
    console.log('serving on port 3000')
})