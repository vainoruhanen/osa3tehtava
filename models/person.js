const mongoose = require('mongoose')

const url = process.env.MONGODB_URI //hakee osoitteen env tiedostosta


console.log('connecting to', url)
mongoose.connect(url)       //muodostaa yhteyden MongoDB
  .then(result =>{
    console.log('connected to MongoDB')
    console.log('result', result)
  })
  .catch((error) =>{
    console.log('Error connecting to MongoDB', error.message)
  })


const personSchema = new mongoose.Schema({      //määritellään henkilön skeema
  name:{
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(str){
        console.log(str)
                
        const arr = str.split('-')

        console.log('arr length', arr.length)
            
        if(arr[0].length != 2 && arr[0].length != 3){
          return false
        }else if(arr.length != 2 ){
          return false
        }else if(isNaN(arr[0]) || isNaN(arr[1])){
          return false
        }else{
          return true 
        }
      },
      message: '{VALUE} ei ole puhelinnumero'
    },
    required: true
  }
})


personSchema.set('toJSON', {    //muotoillaan olio haluttuun muotoon (muutetaan merkkijonoksi toJSON metodilla)
  transform: (document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v       //poistetaan mongoDB:n versiointiin käyttämä kenttä __v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personSchema)