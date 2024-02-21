import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Card, Image, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { ConfirmPopup, PopupContainer, Tooltip } from 'Components/GlobalComponents';
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc, } from "firebase/firestore";
import { db } from "firebase.config";
// import homeIcon from "Assets/images/svg/homeIcon.svg";
import bedIcon from "Assets/images/svg/bedIcon.svg";
import bathtubIcon from "Assets/images/svg/bathtubIcon.svg";
import Header from "Components/LayoutComponents/Header";
import SEO from "Components/SEO";

function Profile() {

	const auth = getAuth();

	/**initial state */
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState(null)
	// const [user, setUser] = useState({})
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth?.currentUser?.displayName,
		email: auth?.currentUser?.email,
	});

	const deleteListingPopup = useRef(null);
	//destructure formData
	const { name, email } = formData;

	const navigate = useNavigate();

	/**Lifecycle hook */
	useEffect(() => {

		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings')

			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc')
			)

			const querySnap = await getDocs(q)

			let listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})
			setListings(listings)
			setLoading(false)
		}
		fetchUserListings()
	}, [auth.currentUser.uid])

	/**Function to change the value of input field */
	function onChange(e) {
		e.preventDefault();
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	}

	/**Function to handle the form  submission */
	const submitHandler = async () => {
		try {
			if (auth.currentUser.displayName !== name) {
				//Update display name in firebase
				await updateProfile(auth.currentUser, { displayName: name });
				//update in firestore
				const userRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(userRef, {
					// name:name
					name,//shorthand
				});
				toast.success("Profile updated successfully!");
			}
		} catch (error) {
			toast.error("Could not update profile details");
		}
	};

	/**Function to logout */
	function onLogout() {
		auth.signOut();
		navigate("/");
	}

	/**Function to delete */
	const onDelete = async (listingId) => {
		if (listingId) {
			await deleteDoc(doc(db, 'listings', listingId))
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			)
			setListings(updatedListings)
			toast.success('Successfully deleted listing')
		}
	}

	/**Function to Edit */
	const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

	return (
		<>
			<SEO title="Profile | UrbanVista" />
			<Header className="py-15">
				<h2 className="mb-0">My Profile</h2>
			</Header>
			<main className="pt-15 mb-60 pb-40">
				<Container>
					<Row className="g-15">
						<Col lg={9}>
							<Card >
								<Card.Body>
									<h3 className="mb-20 fs-22">Personal details</h3>
									{/* <hr className="border" /> */}
									<div className="d-flex align-items-start mb-4">
										{changeDetails ?
											<div className="w-100">
												<FloatingLabel label="Name" className="mb-15">
													<Form.Control
														type="text"
														id="name"
														value={name}
														onChange={onChange}
														disabled={!changeDetails}
														placeholder="Name"
														autoComplete="off"
													/>
												</FloatingLabel>
												<FloatingLabel label="Email">
													<Form.Control
														type="text"
														id="email"
														value={email}
														onChange={onChange}
														disabled={!changeDetails}
														placeholder="Email"
														autoComplete="off"
													/>
												</FloatingLabel>
											</div> :
											<>
												<div className="flex-shrink-0">
													<div
														className="rounded-circle border border-dark border-3 d-flex align-items-center justify-content-center fs-28 fw-bold"
														style={{ width: '70px', height: "70px" }} >
														{name[0]}
													</div>
												</div>
												<div className="flex-grow-1 ms-15">
													<p className=" mb-5 fw-bold"><i className="bi bi-person-fill me-5"></i>{name}</p>
													<p className=""><i className="bi bi-envelope-at-fill me-5"></i>{email}</p>
												</div>
											</>
										}
									</div>
									<hr className="border" />
									<div className="d-flex gap-15 justify-content-end">
										<Button
											type="button"
											size="sm"
											variant="light"
											onClick={() => {
												changeDetails && submitHandler();
												setChangeDetails((prevState) => !prevState);
											}}
										>
											<i className={`${changeDetails ? "bi-check-lg" : "bi-pen-fill"} bi me-5 lh-1`}></i>{changeDetails ? "Done" : "Change"}
										</Button>
										<Button type="button" size="sm" variant="opacity-danger" onClick={() => onLogout()}>
											<i className="bi bi-box-arrow-left me-5"></i>Logout
										</Button>
									</div>
								</Card.Body>
							</Card>
						</Col>
						<Col lg={3}>
							<Button
								as={Link}
								variant="opacity-primary"
								className="d-flex gap-10 align-items-center justify-content-between lh-1"
								to="/create-listing"
							>
								<i className="bi bi-house-fill"></i>
								<p className="mb-0">Sell or rent your home</p>
								<i className="bi bi-chevron-right"></i>
							</Button>
						</Col>
					</Row>
					{!loading && listings?.length > 0 && (
						<div className="mt-45">
							<h3 className="mb-20 fs-22">Your listings</h3>
							<Row className="g-20 custom-animate-fadeup">
								{listings && listings?.map(listing => (
									<Col md={6} lg={4} xl={3} key={listing.id}>
										<Card className="overflow-hidden  shadow-sm category-card">
											<Card.Img loading="lazy" variant="top" alt={listing?.data?.name} className="object-fit-cover h-100 w-100" src={listing.data.imgUrls[0]} style={{ maxHeight: "250px", minHeight: "250px" }} />
											<Card.Body>
												<p className="fw-bold mb-5">{listing.data.name}</p>
												<small className="mb-0 d-block mb-5">{listing.data.location}</small>
												<small className="d-block mb-5">
													Rs&nbsp;
													{listing.data.offer
														? listing.data.discountedPrice
															.toString()
															.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
														: listing.data.regularPrice
															.toString()
															.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
													{listing.data.type === "rent" && " / Month"}
												</small>
												<div className="d-flex justify-content-between mb-10">
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
												<div className="d-flex flex-column flex-md-row gap-15 justify-content-end">
													<Tooltip content="View" placement="top">
														<Button variant="light" size="sm" as={Link} to={`/category/${listing.data.type}/${listing?.id}`}>
															<i className="bi bi-eye-fill"></i>
															<span className="ms-5 d-inline-block d-md-none">View</span>
														</Button>
													</Tooltip>
													<Tooltip content="Edit" placement="top">
														<Button size="sm" onClick={() => onEdit(listing?.id)}>
															<i className="bi bi-pencil-square"></i>
															<span className="ms-5 d-inline-block d-md-none">Edit</span>
														</Button>
													</Tooltip>
													<Tooltip content="Delete" placement="top">
														<Button variant="danger" size="sm" onClick={() => deleteListingPopup.current.showModal({ id: listing?.id, name: listing?.data.name })}>
															<i className="bi bi-trash3"></i>
															<span className="ms-5 d-inline-block d-md-none">Delete</span>
														</Button>
													</Tooltip>
												</div>
											</Card.Body>
										</Card>
									</Col>))}
							</Row>
						</div>
					)}
				</Container>
			</main>
			<PopupContainer
				dialogClassName="custom-popup--sm modal-dialog-sm-end"
				ref={deleteListingPopup}
			>
				<ConfirmPopup
					popupRef={deleteListingPopup}
					title="Delete"
					message="Are you sure to delete this ?"
					icon="bi bi-trash"
					submitBtnText="Delete"
					callback={(status, data) => {
						deleteListingPopup.current.closeModal();
						if (status && data) {
							onDelete(data);
						}
					}}
				/>
			</PopupContainer>
		</>
	);
}

export default Profile;
