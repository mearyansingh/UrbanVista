import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinners from '../Components/Spinners'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Button, Badge } from 'react-bootstrap'

function Listing() {

	/**initial state */
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [shareLinkCopied, setShareLinkCopied] = useState(false)

	const navigate = useNavigate()
	const params = useParams()
	const auth = getAuth()

	/**Lifecycle method */
	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				console.log(docSnap.data(), "data")
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

	return (
		<>
			{/* SLIDER */}

			<Button
				variant=""
				style={{ width: "3rem", height: "3rem", top: "3%", right: "5%" }}
				className='bg-light rounded-circle border-0 position-fixed d-flex align-items-center justify-content-center'
				onClick={() => {
					navigator.clipboard.writeText(window.location.href)
					setShareLinkCopied(true)
					setTimeout(() => {
						setShareLinkCopied(false)
					}, 2000)
				}}
			>
				<img src={shareIcon} alt='' />
			</Button>
			{shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

			<div>
				<p>{listing?.name} - ${listing?.offer ? listing?.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing?.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
				<p>{listing?.location}</p>
				<Badge bg='success'>
					For {listing?.type === 'rent' ? 'Rent' : 'Sale'}
				</Badge>
				{listing?.offer && (
					<Badge bg='dark'>
						${listing?.regularPrice - listing?.discountedPrice} discount
					</Badge>
				)}
				<ul className='list-unstyled'>
					<li>
						{listing?.bedrooms > 1
							? `${listing?.bedrooms} Bedrooms`
							: '1 Bedroom'}
					</li>
					<li>
						{listing?.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: '1 Bathroom'}
					</li>
					<li>{listing?.parking && 'Parking Spot'}</li>
					<li>{listing?.furnished && 'Furnished'}</li>
				</ul>

				<p className='listingLocationTitle'>Location</p>
				{/* MAP */}
				{auth?.currentUser?.uid !== listing?.userRef && (
					<Link
						to={`/contact/${listing?.userRef}?listingName=${listing.name}`}
						className='primaryButton'
					>
						Contact Landlord
					</Link>
				)}
			</div>
		</>
	)
}

export default Listing