import React, { useState, useCallback, useEffect } from 'react';
import { AddressAutofill, AddressMinimap, useConfirmAddress, config } from '@mapbox/search-js-react';
import { Form, Button, Container, Row, Col, Card, Image, ListGroup, CloseButton } from "react-bootstrap";

function LocationSearchInput() {

	const [value, setValue] = useState("")
	const [places, setPlaces] = useState([])

	useEffect(() => {
		getPlaces()
	}, [value])

	const getPlaces = async () => {
		const promise = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=pk.eyJ1IjoiYXJ5YW4xOCIsImEiOiJjbGwzb2FrNjIwbW9rM2VvNW5hZm9oOGgxIn0.2rKa2qR8HkNfijcGowikzQ`)
		const data = await promise.json();
		console.log(data, "ggg")
		setPlaces(data.features)
	}


	return (
		<>
			<Form.Label>Address</Form.Label>
			<div className='position-relative'>
				<Form.Control
					placeholder="Enter address"
					className='pe-4'
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<CloseButton size="sm" className="position-absolute top-0 end-0 p-0 mt-2 me-2 border-0" aria-label="Clear" onClick={() => setValue("")} />
			</div>
			{((places && (places.length > 0))) &&
				<div className="tjs-location--search_dropdown  mt-2">
					<Card className="tjs-card-shadow">
						<Card.Body >
							<ListGroup className="tjs-scrollbar">
								{places && places.length > 0 && places.map((item) => {
									return (
										<ListGroup.Item key={item.id} style={{ cursor: 'pointer' }} className='cursor-pointer px-15 py-10 d-flex align-items-center' >
											<i className="bi bi-geo-alt me-3"></i>
											<small className='text-truncate'>{item.place_name}</small>
										</ListGroup.Item>
									);
								})}
							</ListGroup>
						</Card.Body>
					</Card>
				</div>
			}
		</>
	);
};
export default LocationSearchInput