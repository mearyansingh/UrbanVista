import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Form, Container, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getDoc, doc } from 'firebase/firestore'
import { db } from "firebase.config"
import Header from 'Components/LayoutComponents/Header'

function Contact() {

	/**initial state */
	const [message, setMessage] = useState('')
	const [landlord, setLandlord] = useState(null)
	//eslint-disable-next-line
	const [searchParams, setSearchParams] = useSearchParams()

	const params = useParams()

	/**Lifecycle hook */
	useEffect(() => {
		const getLandlord = async () => {
			const docRef = doc(db, 'users', params.landlordId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				setLandlord(docSnap.data())
			} else {
				toast.error('Could not get landlord data')
			}
		}
		getLandlord()

	}, [params.landlordId])

	return (
		<>
			<Header>
				<h2 className='mb-0'>Contact Landlord</h2>
			</Header>
			{landlord !== null && (
				<main className='flex-grow-1 pt-15 mb-60 pb-40'>
					<Container>
						<p><i className="bi bi-person-rolodex me-5"></i>Contact: {landlord?.name}</p>
						<Form>
							<Form.Group className='mb-20'>
								<Form.Label htmlFor='message'>
									Message
								</Form.Label>
								<Form.Control
									name='message'
									id='message'
									as='textarea'
									rows={5}
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								></Form.Control>
							</Form.Group>
							<div className='d-flex align-items-center justify-content-center w-100'>
								<a
									href={`mailto:${landlord.email}?Subject=${searchParams.get(
										'listingName'
									)}&body=${message}`}
								>
									<Button type='button'>
										Send Message
									</Button>
								</a>
							</div>
						</Form>
					</Container>
				</main>
			)}
		</>
	)
}

export default Contact