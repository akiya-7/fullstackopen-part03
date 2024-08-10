require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person')

const app = express();

// Getting response
morgan.token('jsonRequest', (req, res)=>{
    console.log(req.body[0]);
    if(req.body)
        return JSON.stringify(req.body)})
const postParameters = ':method :url :status :res[content-length] - :response-time ms :jsonRequest'

app.use(express.json())
app.use(morgan(postParameters))
app.use(express.static('dist'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send('<h1>Hello World</h1>')
})

app.get("/api/persons", (req, res) => {
    Person
        .find({})
        .then(result => {
            res.json(result)
        })
})
app.post("/api/persons", (req, res) => {
    const newPerson = req.body;

    if (!newPerson) {
        return res.status(400).json({error: 'name or number is missing'})
    }

    const person = new Person({
        name: newPerson.name,
        number: newPerson.number,
    })

    person.save()
        .then(savedNote => res.json(savedNote))
})

app.get("/api/info", (req, res) => {
    const dayInfo = new Date(Date.now())

    const info =
        `<p>Phonebook has info for ${persons.length} <br/><br/> ${dayInfo}</p>`

    res.send(info)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;

    Person.findById(id)
        .then(person => res.json(person))

})
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)

    res.status(204)
        .end()
})

const PORT = process.env.PORT
app.listen(PORT, () =>
    console.log(`Server started on port: ${PORT}`))