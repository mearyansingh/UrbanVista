import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Card, Image, Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {

	const auth = getAuth();

	/**initial state */
	const [user, setUser] = useState({})
	const [changeDetails, setChangeDetails] = useState(false);
	const [formData, setFormData] = useState({
		name: auth?.currentUser?.displayName,
		email: auth?.currentUser?.email,
	});

	//destructure formData
	const { name, email } = formData;

	const navigate = useNavigate();

	/**Function to change the value of input field */
	function onChange(e) {
		e.preventDefault();
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	}

	/**Lifecycle hook */
	// useEffect(() => {

	// 	const fetchUserListings = async () => {
	// 		const listingsRef = collection(db, 'listings')

	// 		const q = query(
	// 			listingsRef,
	// 			where('userRef', '==', auth.currentUser.uid),
	// 			orderBy('timestamp', 'desc')
	// 		)

	// 		const querySnap = await getDocs(q)

	// 		let listings = []

	// 		querySnap.forEach((doc) => {
	// 			return listings.push({
	// 				id: doc.id,
	// 				data: doc.data(),
	// 			})
	// 		})

	// 		setListings(listings)
	// 		setLoading(false)
	// 	}

	// 	fetchUserListings()
	// }, [auth.currentUser.uid])
	useEffect(() => {
		setUser(auth.currentUser)
	}, [])

	/**Function to logout */
	function onLogout() {
		auth.signOut();
		navigate("/");
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

	return (
		<>
			<header className="py-4 bg-light">
				<Container>
					<div className="lh-1 d-flex justify-content-between align-items-center">
						<h1 className="mb-0 lh-1">My Profile</h1>
						<Button type="button" onClick={() => onLogout()}>
							Logout
						</Button>
					</div>
				</Container>
			</header>
			<main className="py-5">
				<Container>
					<div className="d-flex align-items-center justify-content-between">
						<h5 className="mb-0">Personal Details</h5>
						<Button
							variant="link"
							className="p-0 text-decoration-none"
							onClick={() => {
								changeDetails && submitHandler();
								setChangeDetails((prevState) => !prevState);
							}}
						>
							{changeDetails ? "Done" : "Change"}
						</Button>
					</div>
					<Card>
						<Card.Body>
							<Form>
								<FloatingLabel label="Name" className="mb-3">
									<Form.Control
										type="text"
										id="name"
										value={name}
										onChange={onChange}
										disabled={!changeDetails}
										placeholder="Name"
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
									/>
								</FloatingLabel>
							</Form>
						</Card.Body>
					</Card>
					<Button
						as={Link}
						variant="outline-secondary"
						className="d-flex gap-10 align-items-center justify-content-between mt-5"
						to="/create-listing"
					>
						<Image src={homeIcon} alt="home" />
						<p className="mb-0">Sell or rent your home</p>
						<Image src={arrowRight} alt="arrow-right" />
					</Button>
				</Container>
			</main>
		</>
	);
}

export default Profile;
