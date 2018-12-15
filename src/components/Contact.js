import React from 'react'

const Contact = ({ data, removeContact }) => {
	return (
		<tr className='contact'>
			<td>{data.name}</td>
			<td>{data.number}</td>
			<td>
				<button
					onClick={removeContact(data.id)}>poista</button>
			</td>
		</tr>
	)
}

export default Contact