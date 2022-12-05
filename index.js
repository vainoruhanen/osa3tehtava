require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('info', function(req, res) {
    const body = JSON.stringify(req.body)
    return body;
});

app.use(morgan(':method :status :res[content-length] - :response-time ms :info'))



let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (req, res) =>{     //lähettää hello worldin sivun perus osotteeseen
    res.send('<h1>Hello world</h1>')
})


app.get('/api/persons', (req, res) =>{      //lähettää json muodossa tiedot persons arraystä
    Person.find({}).then(persons =>{        //hakee tiedot henkilöistä mongodb:stä
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) =>{      //Näyttää yksittäisen henkilön tiedot haetulla id:llä
    Person.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        } else{
            res.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) =>{
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


const generateID = () => {
    const newID = Math.floor(Math.random() * 1000)  //generoi satunnaisen id
    console.log('id', newID)
    
    return newID
}

app.put('/api/persons/:id', (req, res, next) =>{
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new : true})
    .then(updatedPerson =>{
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) =>{     //huolehtii uuden henkilön lisäämisestä
    const body = req.body   //post pyynnön mukana lähetetyt tiedot
    
    persons.map(person =>{  //jos koitetaan lisätä henkilöä nimellä joka on jo listalla palautetaan status 400 bad request, virhe viestillä name must be unique
        if(person.name === body.name){
            return res.status(400).json({
                error: 'name must be unique'
            })
        }
    })


    const person = new Person({ //luodaan uusi henkilö käyttäen pyynnön mukana annettuja tietoja
        name:  body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson=>{
        res.json(savedPerson)       //lähettää json mudossa tiedot henkilöstä
    }) 
    .catch(error => next(error))
})



app.get('/info', (req, res) =>{ //info sivu jolla kerrotaan henkilöiden määrä, sekä tämän hetkinen aika
    Person.find({}).then(persons =>{     
        const result = persons.reduce((acc, person) => acc + 1, 0);
        console.log(result)

        const message =`Phonebook has info for ${result} people <br/> ${new Date()}`

        res.send(message)
    })
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if(error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})