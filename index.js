const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) =>{      //Näyttää yksittäisen henkilön tiedot haetulla id:llä
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
   
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) =>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id != id) //päivittää persons arrayn, henkilön poistettua

    res.status(204).end()       //palauttaa statusksen 204 (no content) poiston jälkeen
})


const generateID = () => {
    const newID = Math.floor(Math.random() * 1000)  //generoi satunnaisen id
    console.log('id', newID)
    
    return newID
}


app.post('/api/persons', (req, res) =>{     //huolehtii uuden henkilön lisäämisestä
    const body = req.body   //post pyynnön mukana lähetetyt tiedot
    
    if(!body.name || !body.number){ //jos pyynnöstä puuttoo nimi tai numero palautetaan status 400 bad request, viestillä content missing
        return res.status(400).json({
            error: 'content missing'
        })
    }

    persons.map(person =>{  //jos koitetaan lisätä henkilöä nimellä joka on jo listalla palautetaan status 400 bad request, virhe viestillä name must be unique
        if(person.name === body.name){
            return res.status(400).json({
                error: 'name must be unique'
            })
        }
    })


    const person = { //luodaan uusi henkilö käyttäen pyynnön mukana annettuja tietoja
        id: generateID(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)    //lisätään henkilö persons array:in
    res.json(person) //lähettää json mudossa tiedot henkilöstä
})



app.get('/info', (req, res) =>{ //info sivu jolla kerrotaan henkilöiden määrä, sekä tämän hetkinen aika
    
    const message =`Phonebook has info for ${persons.length} people <br/> ${new Date()}`

    res.send(message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})