const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const morgan = require('morgan')
morgan.token('requestData', function(req, res) { return JSON.stringify(req.body) })

let contacts = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :requestData :status :res[content-length] - :response-time ms'))

const generateStatus = () => {
    return `<p>puhelinluettelossa ${contacts.length} henkilön tiedot</p>
    <p>${new Date()}</p>`
}

app.get('/api/persons', (req, res) => {
    res.send(contacts)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        res.json(contact)
    } else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    res.send(generateStatus())
})

const generateId = () => {
    return Math.ceil(Math.random() * 100000)
}

const existingContact = (name) => {
    return contacts.find(contact => contact.name === name)
}

app.post('/api/persons/', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({error: 'pakollisia tietoja puuttuu'})
    } else if (existingContact(body.name)) {
        return res.status(400).json({error: 'nimellä löytyy jo yhteystieto'})
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    contacts = contacts.concat(contact)

    res.json(contact)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})