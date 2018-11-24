const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

const morgan = require('morgan')
morgan.token('requestData', function(req, res) { return JSON.stringify(req.body) })

const Contact = require('./models/contact')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :requestData :status :res[content-length] - :response-time ms'))
app.use(express.static('build'))

app.get('/api/contacts', (req, res) => {
    Contact
        .find({})
        .then(contacts => {
            res.json(contacts.map(Contact.format))
        })
})

app.get('/api/contacts/:id', (req, res) => {
    Contact
        .findById(req.params.id)
        .then(contact => {
            if (contact) {
                res.json(Contact.format(contact))
            } else {
                res.status(404).end()
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (req, res) => {
    Contact.countDocuments({}, (err, count) => {
        res.send(`<p>puhelinluettelossa ${count} henkilön tiedot</p>
        <p>${new Date()}</p>`)
    })
})

app.post('/api/contacts', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'required information missing'})
    }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact
        .save()
        .then(Contact.format)
        .then(savedAndFormattedContact => {
            res.json(savedAndFormattedContact)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send({ error: err.message })
        })
})

app.put('/api/contacts/:id', (req, res) => {
    const body = req.body

    const contact = {
        name: body.name,
        number: body.number
    }

    Contact
        .findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(Contact.format)
        .then(updatedAndFormattedContact => {
            res.json(updatedAndFormattedContact)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send({ error: 'malformatted id'})
        })
})

app.delete('/api/contacts/:id', (req, res) => {
    Contact
        .findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(err => {
            console.log(err)
            res.status(400).send({ error: 'malformatted id'})
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})