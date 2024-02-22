import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image, Container, Card, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { db } from "../firebase.config";
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from "firebase/firestore";
import bedIcon from "Assets/images/svg/bedIcon.svg";
import bathtubIcon from "Assets/images/svg/bathtubIcon.svg";
import { ListEmptyPlaceholder, Loader } from "Components/GlobalComponents";
import Header from "Components/LayoutComponents/Header";
import SEO from "Components/SEO";
import { formatIndianNumber } from "Services/helpers";

function Offers() {

	/**initial state */
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListing, setLastFetchedListing] = useState(null) //for pagination/load more

	/**lifecycle hook */
	useEffect(() => {
		const fetchListings = async () => {
			try {
				//get reference
				const listingRef = collection(db, "listings");

				//create a query
				const q = query(
					listingRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(10)
				);

				//execute query
				const querySnap = await getDocs(q);
				//for load more
				const lastVisible = querySnap.docs[querySnap.docs.length - 1]
				setLastFetchedListing(lastVisible)

				const listings = [];

				querySnap.forEach((doc) => {
					return listings.push({
						id: doc?.id,
						data: doc.data(),
					});
				});
				setListings(listings);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching listings:", error);
				toast.error("Could not fetch listings");
				setLoading(false);
			}
		};
		fetchListings();
	}, []);

	/**Pagination / Load more */
	const onFetchMoreListings = async () => {
		try {
			//Get reference
			const listingRef = collection(db, "listings");
			//create a query
			const q = query(
				listingRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
				startAfter(lastFetchedListing),
				limit(10)
			);
			//execute query
			const querySnap = await getDocs(q);

			const lastVisible = querySnap.docs[querySnap.docs.length - 1]
			setLastFetchedListing(lastVisible)

			const listings = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc?.id,
					data: doc?.data(),
				});
			});
			setListings((prevState) => [...prevState, ...listings]);
			setLoading(false);
		} catch (error) {
			console.log(error, "error")
			toast.error("Could not fetch listings");
			setLoading(false);
		}
	};

	if (loading) {
		return <Loader loading />;
	}

	return (
		<>
			<SEO title="Offers | UrbanVista" />
			<Header>
				<h2 className="mb-0">Offers</h2>
			</Header>
			<main className="flex-grow-1 pt-15 mb-60 pb-40">
				<Container>
					{listings?.length > 0 ? (
						<>
							<Row className="g-20">
								{listings && listings?.map(listing => (
									<Col md={6} lg={4} key={listing.id}>
										<Card as={Link} to={`/category/${listing.data.type}/${listing?.id}`} className="category-card overflow-hidden shadow-sm h-100">
											<Card.Img
												loading="lazy"
												variant="top"
												className="object-fit-cover w-100 h-100"
												src={listing?.data?.imgUrls[0]}
												alt={listing?.data?.name}
												style={{
													maxHeight: "250px",
													minHeight: "250px "
												}}
											/>
											<Card.Body>
												<p className="fw-bold mb-5">{listing.data.name}</p>
												<small className="mb-0 d-block mb-5">{listing.data.location}</small>
												<small className="d-block mb-5">
													Rs.&nbsp;
													{listing.data.offer
														? formatIndianNumber(listing.data.discountedPrice)
														: formatIndianNumber(listing.data.regularPrice)
													}
													{listing.data.type === "rent" && " / Month"}
												</small>
												<div className="d-flex align-items-center gap-15">
													<div className="d-flex align-items-center">
														<Image fluid src={bedIcon} alt="Bedroom_img" width={30} height={30} />
														<small className="ps-1 mb-0">
															{listing.data.bedrooms > 1
																? `${listing.data.bedrooms} Bedrooms`
																: "1 Bedroom"}
														</small>
													</div>
													<div className="d-flex align-items-center ">
														<Image src={bathtubIcon} alt="Bathroom_img" width={30} height={30} />
														<small className="ps-1 mb-0">
															{listing.data.bathrooms > 1
																? `${listing.data.bathrooms} Bathrooms`
																: "1 Bathroom"}
														</small>
													</div>
												</div>
											</Card.Body>
										</Card>
									</Col>))}
							</Row>
							{lastFetchedListing &&
								<Button variant="primary" type="button" className="mx-auto d-block mt-30" onClick={onFetchMoreListings}>Load More</Button>
							}
						</>
					)
						:
						<Card className="custom-animate-fadeup">
							<Card.Body>
								<ListEmptyPlaceholder message="There are no current offers." contentWrapperClass="w-100-md px-30 px-md-0 w-50 mx-md-auto" />
							</Card.Body>
						</Card>
					}
				</Container>

			</main>

		</>
	);
}
export default Offers;
