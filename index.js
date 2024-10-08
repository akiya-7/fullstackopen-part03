const express = require('express');
const morgan = require('morgan');

const app = express();

// Getting response
morgan.token('jsonResponse', (req, res)=>{
    console.log(req.body[0]);
    if(req.body)
        return JSON.stringify(req.body)})
const postParameters = ':method :url :status :res[content-length] - :response-time ms :jsonResponse'

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
    res.send(persons)

})
app.post("/api/persons", (req, res) => {
    const newPerson = req.body;

    if (!newPerson["name"] || !newPerson["number"]) {
        return res.status(400)
            .json({error: "Please ensure a name and number is entered"})
    }

    const isExisting = () => {
        const names = persons.map(person => person.name)
        return names.includes(newPerson.name)
    }
    if (isExisting()) {
        return res.status(400)
            .json({error: "Name is already in use"})
    }

    const generateId = () => {
        return (Math.random()).toString().substr(2, 9);
    };

    const person = {
        name: newPerson["name"],
        number: newPerson["number"],
        id: generateId()
    }
    persons = persons.concat(person);
    res.json(person)
})

app.get("/api/info", (req, res) => {
    const dayInfo = new Date(Date.now())

    const info =
        `<p>Phonebook has info for ${persons.length} <br/><br/> ${dayInfo}</p>`

    res.send(info)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find((person) => person.id === id)

    if (person)
        res.send(person)
    else
        res.status(404).json({error: "This person does not exist"})
})
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)

    res.status(204)
        .end()
})

const PORT = 3000
app.listen(PORT, () =>
    console.log(`Server started on port: ${PORT}`))