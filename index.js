require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person')

const app = express();

// Getting response
morgan.token('jsonRequest', (req)=>{
    console.log(req.body[0]);
    if(req.body)
        return JSON.stringify(req.body)})
const postParameters = ':method :url :status :res[content-length] - :response-time ms :jsonRequest'

app.use(express.json())
app.use(morgan(postParameters))
app.use(express.static('dist'))

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
    let personsLength;

    Person.find({}).then(list => {
        personsLength = list.length
        const info = `<p>Phonebook has info for ${personsLength} people <br/><br/> ${dayInfo}</p>`
        res.send(info)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id;

    Person.findById(id)
        .then(person =>
        {
            if (person){
                res.json(person)
            }
            else{
                res.status(404)
                    .end()
            }
        })
        .catch(error => next(error))

})
app.put("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const updatedInfo = req.body;

    Person.findByIdAndUpdate(id, {id: id, name: updatedInfo.name, number: updatedInfo.number}).then(
        update => res.json(update)
    )
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findByIdAndDelete(id).then(result => console.log(result.name, "has been deleted"))

    res.status(204)
        .end()
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () =>
    console.log(`Server started on port: ${PORT}`))