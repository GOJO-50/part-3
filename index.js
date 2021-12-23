const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')



const app = express()
app.use(express.json())


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
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

  app.get('/api/persons', (request, response) =>{
    response.json(persons)
  })

  app.get('/info', (request, response)=> {
    const size = persons.length
    const time = new Date()
    response.send(`<p>Phonebook has info for ${size} people</p>
    <p>${time}</p>
    `)
  })

  app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find (p => p.id === id)

    if (person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id === id)
    response.status(204).end()
  })

  const getId = () => {
    const lastId = persons.length > 0 ? Math.floor(Math.random() * 1000) : 0

  return lastId + 1
  }
  app.post('/api/persons', (request, response) => {
    const p = request.body
     console.log(p);
    const nPerson = {
      name: p.name,
      number: p.number,
      id: getId()
    }
    const currentName = persons.filter(per => per.name === nPerson.name)

    if(!p.name || !p.number){
      return response.status(400).json({
        error: `a name or number is missing`
      })
    }  
    if(currentName[0] !== undefined) {
      return response.status(400).json({
        error: `name must be unique`
      })
    }
    response.json(nPerson)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)