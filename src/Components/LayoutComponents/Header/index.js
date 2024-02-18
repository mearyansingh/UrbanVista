import React from 'react'
import Container from 'react-bootstrap/Container'


function Header({ children }) {

	return (
		<header className="pt-30 pb-15">
			<Container>
				{children}
			</Container>
		</header>

	)
}

export default Header