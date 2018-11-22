const mongoose = require('mongoose')
const CONFIG = require('../config/config.js')
const URL = `mongodb://${CONFIG.development["db-usr"]}:${CONFIG.development["db-pwd"]}@ds145083.mlab.com:45083/fsmooc-puhelinluettelo`

mongoose.connect(URL, { useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

contactSchema.statics.format = (contact) => {
    return {
        name: contact.name,
        number: contact.number,
        id: contact._id
    }
}

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact