/* eslint-disable no-unused-vars */
require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


let persons = [
	{
		'id': 1,
		'name': 'Arto Hellas',
		'number': '040-123456'
	},
	{
		'id': 2,
		'name': 'Ada Lovelace',
		'number': '39-44-5323523'
	},
	{
		'id': 3,
		'name': 'Dan Abramov',
		'number': '12-43-234345'
	},
	{
		'id': 4,
		'name': 'Mary Poppendieck',
		'number': '39-23-6423122'
	}
]

app.use(morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
	].join(' ')
}))



app.get('/api/persons', (request, response) => {
	Person.find({}).then(person => {
		response.json(person)
	})
})

app.get('/info', (request, response) => {
	const size = persons.length
	const time = new Date()

	response.send(`<p>Phonebook has info for ${size} people</p>
    <p>${time}</p>
    `)
})

app.get('/api/persons/:id', (request, response, next) => {

	Person.findById(request.params.id)
		.then(person => {
			if (person){
				response.json(person)
			}else{
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error =>
			next(error))
})

app.post('/api/persons', (request, response) => {
	const p = request.body
	console.log(p)

	const person = new Person ({
		name: p.name,
		number: p.number,
	}
	)
	const currentName = persons.filter(per => per.name === person.name)

	if(!p.name || !p.number){
		return response.status(400).json({
			error: 'a name or number is missing'
		})
	}

	if(currentName[0] !== undefined) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}
	person.save().then(addedPerson => {
		response.json(addedPerson)
	})
})
app.put('/api/persons/:id', (request, response, next) => {
	const p = request.body
	Person.findById(request.params.id)

	const person = {
		name: p.name,
		number: p.number
	}

	Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => {
		response.json(updatedPerson)
	})
		.catch(error => next(error))
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}
app.use(errorHandler)