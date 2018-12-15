import React from 'react'
import Contact from '../components/Contact'

const CatalogueDisplay = ({ catalogue, filterString, removeContact }) => {
  const catalogueData =
    !filterString ?
      catalogue :
      catalogue.filter(el => {
        return el.name.toLowerCase().includes(filterString.toLowerCase())
      })

  const rows = catalogueData.map(el => {
    return <Contact
              key={el.id}
							data={el}
							removeContact={removeContact} />
  })

  return (
    <div>
      <h3>Yhteystiedot</h3>
      <table className='contacts-display'>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default CatalogueDisplay