import React from 'react'
import contactService from './services/contacts'
import CatalogueDisplay from './components/CatalogueDisplay'
import Notification from './components/Notification'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
      newName: '',
      newNumber: '',
      filterString: '',
      actionNotification: null
    }
  }

  componentDidMount() {
    contactService.getAll()
      .then(contacts => {
        this.setState({ contacts: contacts })
      })
  }

  displayNotification = ({ msg, name }) => {
    if (name) {
      this.setState({ actionNotification: `${msg}${name}` });
    } else {
      this.setState({ actionNotification: msg });
    }

    setTimeout(() => {
      this.setState({ actionNotification: null })
    }, 5000)
  }

  addContact = (event) => {
    event.preventDefault()
    const existingContact = this.state.contacts.find(el => el.name === this.state.newName)
    if (!existingContact) {
      const newPerson = {
        name: this.state.newName,
        number: this.state.newNumber
      }
      contactService.create(newPerson)
        .then(contact => {
          const newCatalogue = this.state.contacts.concat(contact)
          this.setState({ contacts: newCatalogue })
          this.displayNotification({ msg: 'Lisättiin yhteystieto: ', name: contact.name })
        })
        .catch((error) => {
          console.log(error)
          this.displayNotification({ msg: 'Pakollisia tietoja puuttuu' })
        })
    } else {
      this.updateContact(existingContact)
    }
  }

  updateContact = (contact) => {
    if (window.confirm(`${contact.name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
      const alteredContact = { ...contact, number: this.state.newNumber }
      contactService.update(contact.id, alteredContact)
        .then(updatedContact => {
          const contacts = this.state.contacts.filter(c => c.id !== updatedContact.id)
          this.setState({ contacts: contacts.concat(updatedContact) });
          this.displayNotification({ msg: 'Päivitettiin yhteystieto: ', name: updatedContact.name })
        })
        .catch(error => {
          // console.log(error)
          this.setState({ contacts: this.state.contacts.filter(c => c.id !== contact.id) })
          this.displayNotification({ msg: 'Yhteystieto jota yritit muuttaa on poistettu palvelimelta.', name: null })
        })
    }
  }

  removeContact = (id) => {
    return () => {
      const indexOfRemovalCandidate = this.state.contacts.findIndex(el => el.id === id)
      const updatedContacts = [...this.state.contacts]
      const removalCandidate = updatedContacts.splice(indexOfRemovalCandidate, 1)[0]

      if (window.confirm(`Poistetaanko ${removalCandidate.name}?`)) {
        contactService.remove(id)
          .then((res) => {
            console.log(res)
            this.setState({ contacts: updatedContacts })
            this.displayNotification({ msg: 'Poistettiin yhteystieto: ', name: removalCandidate.name })
          })
      }
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  render() {
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        <Notification
          message={this.state.actionNotification} />
        <div>
          rajaa näytettäviä
          <input
            name='filterString'
            value={this.state.filterString}
            onChange={this.handleInputChange} />
        </div>
        <h3>Lisää uusi</h3>
        <form>
          <div>
            Nimi:
            <input
              name='newName'
              value={this.state.newName}
              onChange={this.handleInputChange} />
          </div>
          <div>
            Numero:
            <input
              name='newNumber'
              value={this.state.newNumber}
              onChange={this.handleInputChange} />
          </div>
          <div>
            <button
              type="submit"
              onClick={this.addContact}>lisää</button>
          </div>
        </form>
        <CatalogueDisplay
          catalogue={this.state.contacts}
          filterString={this.state.filterString}
          removeContact={this.removeContact} />
      </div>
    )
  }
}

export default App
