import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Badge, Container, Image } from 'react-bootstrap'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Map, { Marker, NavigationControl, GeolocateControl, FullscreenControl } from 'react-map-gl';
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import mapboxgl from 'mapbox-gl';
import { db } from 'firebase.config'
import Spinners from 'Components/Spinners'
import { Tooltip } from 'Components/GlobalComponents';

function Listing() {

	/**initial state */
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)

	//useRef hook used
	const markerRef = useRef();

	const popup = useMemo(() => {
		return new mapboxgl.Popup().setText(`${listing?.name}, ${listing?.location}`);
	}, [listing])

	// eslint-disable-next-line no-unused-vars
	const togglePopup = useCallback(() => {
		markerRef.current?.togglePopup();
	}, []);

	const navigate = useNavigate()
	const params = useParams()
	const auth = getAuth()

	/**Lifecycle method */
	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

	if (loading) {
		return <Spinners />
	}

	return (
		<>
			<Tooltip content="Share the link" placement="bottom">
				<Button
					role="button"
					variant="light"
					style={{ width: "3rem", height: "3rem", top: "3%", right: "5%", zIndex: 2 }}
					className='bg-light z-3 rounded-circle border-0 position-fixed d-flex align-items-center justify-content-center'
					onClick={() => {
						navigator.clipboard.writeText(window.location.href)
						toast.success("Link copied!")
					}}
				>
					<i className="bi bi-share-fill"></i>
				</Button>
			</Tooltip>
			{/* SLIDER */}
			<Swiper
				className='w-100'
				// install Swiper modules
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				spaceBetween={50}
				slidesPerView={1}
				// navigation
				pagination={{ clickable: true }}
			// scrollbar={{ draggable: true }}
			// onSwiper={(swiper) => console.log(swiper)}
			// onSlideChange={() => console.log('slide change')}
			>
				{listing?.imgUrls.map((url, index) => (
					<SwiperSlide key={index}>
						<Image fluid src={url} alt="property-gallery" width={500} height={500} />
					</SwiperSlide>
				))}
			</Swiper>
			<Container>
				<div className='pt-15 mb-60 pb-40'>
					<div className='mb-5'>
						<h4 className='mb-5'>{listing?.name} - Rs.{listing?.offer ? listing?.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing?.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h4>
						<p className='mb-5 fw-semibold'>{listing?.location}</p>
						<Badge bg='success' className='mb-5'>
							For {listing?.type === 'rent' ? 'rent' : 'sell'}
						</Badge>
						{listing?.offer && (
							<Badge bg='dark' className='ms-5'>
								Rs&nbsp;{listing?.regularPrice - listing?.discountedPrice} discount
							</Badge>
						)}
					</div>
					<ul className='list-unstyled mb-30 d-flex flex-wrap gap-10'>
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
					<h5 className='listingLocationTitle'>Location</h5>
					{/* MAP */}
					{listing &&
						<Map
							mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
							initialViewState={{
								longitude: listing?.geolocation?.lng,
								latitude: listing?.geolocation?.lat,
								zoom: 14
							}}
							style={{ width: "100%", height: 400, }}
							mapStyle="mapbox://styles/mapbox/streets-v9"
						>
							<Marker longitude={listing?.geolocation?.lng} latitude={listing?.geolocation?.lat} color="red" popup={popup} ref={markerRef} />
							<NavigationControl />
							<GeolocateControl />
							<FullscreenControl />
						</Map>
					}
					{auth?.currentUser?.uid !== listing?.userRef && (
						<div className='d-flex align-items-center'>
							<Button
								as={Link}
								to={`/contact/${listing?.userRef}?listingName=${listing?.name}`}
								className='mt-20 mx-auto'
							>
								Contact Landlord
							</Button>
						</div>
					)}
				</div >
			</Container>
		</>
	)
}

export default Listing
