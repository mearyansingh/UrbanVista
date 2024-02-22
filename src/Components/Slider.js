import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Image } from 'react-bootstrap';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from 'firebase.config'
import { Loader } from './GlobalComponents';
import { formatIndianNumber } from "Services/helpers";

function Slider() {

	/**initial state */
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState(null)

	const navigate = useNavigate()

	/**lifecycle hook */
	useEffect(() => {
		const fetchListing = async () => {
			const listingsRef = collection(db, 'listings')
			const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
			const querySnap = await getDocs(q)
			let listings = []

			querySnap.forEach((doc) => {
				return listings.push({ id: doc?.id, data: doc?.data() })
			})
			setListings(listings)
			setLoading(false)
		}
		fetchListing()
	}, [])

	if (loading) {
		return <Loader loading />
	}

	return (
		<>
			{listings?.length > 0 && (
				<>
					<p className='fw-semibold fs-18'>Recommended</p>
					<Swiper
						className='rounded'
						modules={[Navigation, Pagination, Scrollbar, A11y]}
						slidesPerView={1}
						pagination={{ clickable: true }}
					>
						{listings.map(({ data, id }) => (
							<SwiperSlide
								key={id}
								onClick={() => navigate(`/category/${data?.type}/${id}`)}
							>
								<div
									className='swiperSlideDiv'
								>
									<Image src={data.imgUrls} alt="property-image" />
									<div className='position-absolute top-0 start-0'>
										{data?.name && <p className='bg-dark fw-semibold text-light opacity-75 px-10 py-5 mb-5'>{data.name}</p>}
										<Badge bg="success"><i className="bi bi-tag me-5"></i>
											Rs {formatIndianNumber(data.discountedPrice) ?? formatIndianNumber(data.regularPrice)}{' '}
											{data.type === 'rent' && '/ month'}
										</Badge>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</>
			)}
		</>
	)
}

export default Slider