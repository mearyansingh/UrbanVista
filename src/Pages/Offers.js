import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image, Container, Card, Row, Col } from "react-bootstrap";
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
import Spinner from "../Components/Spinners";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

function Offers() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);

	const params = useParams();

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
	console.log(listings, "listings");

	return (
		<div className="d-flex flex-column" style={{ height: "100vh" }}>
			<header className="py-4 bg-light">
				<Container>
					<h1 className="mb-0 lh-1">Offers</h1>
				</Container>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings?.length > 0 ? (
				<main className="py-5">
					<Container>
						<Row>
							{listings && listings?.map(listing => (
								<Col md={6} key={listing.id}>
									<Card as={Link} to={`/category/${listing.data.type}/${listing?.id}`} className="overflow-hidden shadow-sm text-decoration-none">
										<Row className="g-0">
											<Col>
												<Image
													fluid
													src={listing?.data?.imgUrls?.[0]}
													alt={listing?.data?.name}
													width={500}
													height={300}
												/>
											</Col>
											<Col>
												<Card className="border-0 h-100 text-secondary">
													<Card.Body>
														<div>
															<p>{listing.data.location}</p>
															<p>{listing.data.name}</p>
															<p>
																$
																{listing.data.offer
																	? listing.data.discountedPrice
																		.toString()
																		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
																	: listing.data.regularPrice
																		.toString()
																		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
																{listing.data.type === "rent" && " / Month"}
															</p>
															<div className="d-flex justify-content-between ">
																<div className="d-flex align-items-center">
																	<Image fluid src={bedIcon} alt="Bedroom_img" width={30} height={30} />
																	<p className="ps-1 mb-0">
																		{listing.data.bedrooms > 1
																			? `${listing.data.bedrooms} Bedrooms`
																			: "1 Bedroom"}
																	</p>
																</div>
																<div className="d-flex ">
																	<Image src={bathtubIcon} alt="Bathroom_img" width={30} height={30} />
																	<p className="ps-1 mb-0">
																		{listing.data.bathrooms > 1
																			? `${listing.data.bathrooms} Bathrooms`
																			: "1 Bathroom"}
																	</p>
																</div>
															</div>
														</div>
													</Card.Body>
												</Card>
											</Col>
										</Row>
									</Card>
								</Col>))}
						</Row>
					</Container>
				</main>
			) : (
				<p>There are no current offers.</p>
			)}
		</div>
	);
}
export default Offers;
