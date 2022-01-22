const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
console.log(password);

const url =
  `mongodb+srv://amidou:${password}@cluster0.2c3um.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url)

//Schema
const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})
//model
const Person = mongoose.model('Person', personSchema)

//Saving data to mongo
const person = new Person({
  name: 'Amidou' ,
  number: 3873209
})

person.save().then(result => {
  console.log('contact saved!')
})
Person.find({})
  .then(
      result => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close()
    })
  

