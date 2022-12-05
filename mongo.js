const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]






const url =
`mongodb+srv://fullstack:${password}@cluster0.2jqb999.mongodb.net/PhoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', noteSchema)

const person = new Person({
    name: name,
    number: number,
})

if(!name || !number){           //jos nimeä tai numeroa ei syötetty tulostetaan konsoliin kaikki yhteystiedot
    console.log('phonenbook:')
    Person.find({}).then(result=>{
        result.forEach(person =>{
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
 
}else{
    person.save().then(result=>{
       console.log(`added ${person.name} number ${person.number} to phonebook`)
       mongoose.connection.close()
    })
}



