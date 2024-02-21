import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image, Container, Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "firebase.config";
import Spinner from "Components/Spinners";
import bedIcon from "Assets/images/svg/bedIcon.svg";
import bathtubIcon from "Assets/images/svg/bathtubIcon.svg";
import Header from "Components/LayoutComponents/Header";
import SEO from "Components/SEO";

function Category() {

	/**Initial state */
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const [lastFetchedListing, setLastFetchedListing] = useState(null) //for pagination/load more

	const params = useParams();

	/**Lifecycle hook */
	useEffect(() => {
		const fetchListings = async () => {
			try {
				//Get reference
				const listingRef = collection(db, "listings");
				//create a query
				const q = query(
					listingRef,
					where("type", "==", params?.categoryName),
					orderBy("timestamp", "desc"),
					limit(2)
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
				setListings(listings);
				setLoading(false);
			} catch (error) {
				console.log(error, "error")
				toast.error("Could not fetch listings");
				setLoading(false);
			}
		};
		fetchListings();
	}, [params.categoryName]);

	/**Pagination / Load more */
	const onFetchMoreListings = async () => {
		try {
			//Get reference
			const listingRef = collection(db, "listings");
			//create a query
			const q = query(
				listingRef,
				where("type", "==", params?.categoryName),
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

	return (
		<>
			<SEO title={`${params.categoryName === "rent" ? "Places for rent" : "Places for sell"} | UrbanVista`} />
			<Header>
				<h2 className="mb-0">
					{params.categoryName === "rent" ? "Places for rent" : "Places for sell"}
				</h2>
			</Header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<main className="flex-grow-1 pt-15 mb-60 pb-40">
					<Container>
						<Row className="g-30 custom-animate-fadeup">
							{listings && listings?.map(listing => (
								<Col md={6} lg={4} key={listing.id}>
									<Card as={Link} to={`/category/${listing.data.type}/${listing?.id}`} className="category-card overflow-hidden shadow-sm h-100">
										{/* <Card.Img variant="top" className="object-fit-cover h-100 " src={listing?.data?.imgUrls[0]} alt={listing?.data?.name} /> */}
										<Card.Img variant="top" alt={listing?.data?.name} className="object-fit-cover h-100 w-100" src={listing.data.imgUrls[0]} style={{ maxHeight: "250px", minHeight: "250px" }} />
										<Card.Body>
											<p className="fw-bold mb-5">{listing.data.name}</p>
											<small className="mb-0 d-block mb-5">{listing.data.location}</small>
											<small className="d-block mb-5">
												Rs.&nbsp;
												{listing.data.offer
													? listing.data.discountedPrice
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
													: listing.data.regularPrice
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
					</Container>
				</main>
			) : (
				<p>No listing for {params.categoryName}</p>
			)
			}
		</ >
	);
}
export default Category;
