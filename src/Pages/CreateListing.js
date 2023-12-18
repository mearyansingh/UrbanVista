import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import { Form, Button, Container, Row, Col, Card, Image } from "react-bootstrap";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../firebase.config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import Spinners from "../Components/Spinners";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
// import LocationSearchInput from "../Components/LocationSearchInput";

function CreateListing() {

	/**initial state */
	const [loading, setLoading] = useState(false)
	// const [isBtnActive, setIsBtnActive] = useState(f)
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
	});

	/**destructure */
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData;

	/**Firebase auth */
	const auth = getAuth();
	const navigate = useNavigate();
	const isMounted = useRef(true);

	/**Lifecycle hook */
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user?.uid });
				} else {
					navigate("/sign-in");
				}
			});
		}
		//cleanup function
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);

	if (loading) {
		return <Spinners />;
	}

	/**Function to handle the form submission */
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		console.log(formData, "onsubmit")

		/**Discounted price check */
		if (discountedPrice >= regularPrice) {
			setLoading(false)
			toast.error('Discounted price needs to be less than regular price')
			return
		}

		/**Images limit check */
		if (images.length > 6) {
			setLoading(false)
			toast.error('Max 6 images')
			return
		}

		/**Geolocation */
		let geolocation = {}
		let location
		// https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
		// https://api.mapbox.com/geocoding/v5/mapbox.places/delhi.json?access_token=pk.eyJ1IjoiYXJ5YW4xOCIsImEiOiJjbGwzb2FrNjIwbW9rM2VvNW5hZm9oOGgxIn0.2rKa2qR8HkNfijcGowikzQ
		if (geolocationEnabled) {
			const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`)
			const data = await response.json()

			geolocation.lat = data?.features[0]?.geometry?.coordinates[1] ?? 0
			geolocation.lng = data?.features[0]?.geometry?.coordinates[0] ?? 0
			location = data?.features?.length === 0 ? undefined : data?.features[0]?.text

			if (location === undefined || location.includes('undefined')) {
				setLoading(false)
				toast.error('Please enter a correct address')
			}
		} else {
			geolocation.lat = latitude
			geolocation.lng = longitude
		}
		//store images in firebase
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage()
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
				const storageRef = ref(storage, 'images/' + fileName)
				const uploadTask = uploadBytesResumable(storageRef, image);


				// Listen for state changes, errors, and completion of the upload.
				uploadTask.on('state_changed',
					(snapshot) => {
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
						}
					},
					(error) => {
						reject(error)
					},
					// (error) => {
					// 	// A full list of error codes is available at
					// 	// https://firebase.google.com/docs/storage/web/handle-errors
					// 	switch (error.code) {
					// 		case 'storage/unauthorized':
					// 			// User doesn't have permission to access the object
					// 			break;
					// 		case 'storage/canceled':
					// 			// User canceled the upload
					// 			break;

					// 		// ...

					// 		case 'storage/unknown':
					// 			// Unknown error occurred, inspect error.serverResponse
					// 			break;
					// 	}
					// },
					() => {
						// Upload completed successfully, now we can get the download URL
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			})
		}
		const imgUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false)
			toast.error('Images not uploaded')
			return
		})

		// console.log(imgUrls, "imgUrls")
		const formDataCopy = {
			...formData,
			imgUrls,
			geolocation,
			timestamp: serverTimestamp()
		}
		formDataCopy.location = address
		delete formDataCopy.images
		delete formDataCopy.address

		!formData.offer && delete formDataCopy.discountedPrice
		delete formDataCopy.images
		const docRef = await addDoc(collection(db, "listings"), formDataCopy)
		setLoading(false)
		toast.success('Listing Saved')
		navigate(`/category/${formDataCopy.type}/${docRef.id}`)
	};
	// "REQUEST_DENIED"
	/**function to handle onChange  */
	const onMutate = (e) => {
		console.log(e.target.id, e.target.value)
		let boolean = null

		if (e.target.value === 'true') {
			boolean = true
		}
		if (e.target.value === 'false') {
			boolean = false
		}
		// Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}))
		}
		// Text/Booleans/Numbers
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}))
		}
	};

	return (
		<div>
			<header className="py-4 bg-light">
				<Container>
					<h1 className="mb-0">Create a listing</h1>
				</Container>
			</header>
			<main className="py-5">
				<Container>
					<Card className="overflow-hidden">
						<Row className="g-0">
							<Col sm={6}>
								<Image fluid alt="listing_img" className="h-100" src={rentCategoryImage} width={800} height={1000} />
							</Col>
							<Col sm={6}>
								<Card className="border-0">
									<Card.Body>
										<Form onSubmit={onSubmit}>
											<Form.Group className="mb-3">
												<Form.Label className="d-block">Sell / Rent</Form.Label>
												<Button
													type="button"
													variant={type === "sell" ? "success" : "secondary"}
													id="type"
													value='sell'
													onClick={onMutate}
												>
													Sell
												</Button>
												<Button
													type="button"
													variant={type === "rent" ? "success" : "secondary"}
													id="type"
													value="rent"
													onClick={onMutate}
													className="ms-3"
												>
													Rent
												</Button>
											</Form.Group>
											<Form.Group className="mb-3">
												<Form.Label>Name</Form.Label>
												<Form.Control
													type='text'
													id='name'
													value={name}
													onChange={onMutate}
													placeholder="Enter name"
													required
												/>
											</Form.Group>
											<Row className="mb-3">
												<Form.Group as={Col}>
													<Form.Label>Bedrooms</Form.Label>
													<Form.Control
														type='number'
														id='bedrooms'
														value={bedrooms}
														onChange={onMutate}
														min='1'
														max='50'
														required
													/>
												</Form.Group>
												<Form.Group as={Col}>
													<Form.Label>Bedrooms</Form.Label>
													<Form.Control
														type='number'
														id='bathrooms'
														value={bathrooms}
														onChange={onMutate}
														min='1'
														max='50'
														required
													/>
												</Form.Group>
											</Row>
											<Row className="mb-3">
												<Form.Group as={Col}>
													<Form.Label className="d-block">Parking spot</Form.Label>
													<Button
														variant={parking ? "success" : "secondary"}
														type='button'
														id='parking'
														value={true}
														onClick={onMutate}
														min='1'
														max='50'
													>
														Yes
													</Button>
													<Button
														variant={!parking && parking !== null ? "success" : "secondary"}
														type='button'
														id='parking'
														value={false}
														onClick={onMutate}
														className="ms-3"
													>
														No
													</Button>
												</Form.Group>
												<Form.Group as={Col}>
													<Form.Label className="d-block">Furnished</Form.Label>
													<Button
														variant={furnished ? "success" : "secondary"}
														type='button'
														id='furnished'
														value={true}
														onClick={onMutate}
														min='1'
														max='50'
													>
														Yes
													</Button>
													<Button
														variant={!furnished && furnished !== null ? "success" : "secondary"}
														type='button'
														id='furnished'
														value={false}
														onClick={onMutate}
														className="ms-3"
													>
														No
													</Button>
												</Form.Group>
											</Row>
											<Form.Group className="mb-3">
												<Form.Label>Address</Form.Label>
												<Form.Control
													as="textarea"
													id='address'
													value={address}
													onChange={onMutate}
													required
													placeholder="Enter address"
												/>
												{/* <LocationSearchInput /> */}
											</Form.Group>
											{!geolocationEnabled && (
												<Row className="mb-3">
													<Form.Group as={Col}>
														<Form.Label>Latitude</Form.Label>
														<Form.Control
															type='number'
															id='latitude'
															value={latitude}
															onChange={onMutate}
															required
															placeholder="Latitude"
														/>
													</Form.Group>
													<Form.Group as={Col}>
														<Form.Label>Longitude</Form.Label>
														<Form.Control
															type='number'
															id='longitude'
															value={longitude}
															onChange={onMutate}
															required
															placeholder="Longitude"
														/>
													</Form.Group>
												</Row>
											)}
											<Row className="mb-3">
												<Form.Group as={Col}>
													<Form.Label className="d-block">Offer</Form.Label>
													<Button
														variant={offer ? 'success' : 'secondary'}
														type='button'
														id='offer'
														value={true}
														onClick={onMutate}
													>
														Yes
													</Button>
													<Button
														variant={
															!offer && offer !== null ? 'success' : 'secondary'
														}
														type='button'
														id='offer'
														value={false}
														onClick={onMutate}
														className="ms-3"
													>
														No
													</Button>
												</Form.Group>

												<Form.Group as={Col}>
													<Form.Label>Regular price</Form.Label>
													<Form.Control
														type='number'
														id='regularPrice'
														value={regularPrice}
														onChange={onMutate}
														min='50'
														max='750000000'
														required
													/>
													{type === 'rent' && <Form.Text id="regularPriceHelpBlock" muted>
														$ / Month
													</Form.Text>}
												</Form.Group>
											</Row>
											{offer && (
												<Form.Group className="mb-3">
													<Form.Label>Discounted Price</Form.Label>
													<Form.Control
														type='number'
														id='discountedPrice'
														value={discountedPrice}
														onChange={onMutate}
														min='50'
														max='750000000'
														required={offer}
													/>
												</Form.Group>
											)}
											<Form.Group className="mb-3">
												<Form.Label className="mb-0">Images</Form.Label>
												<p className='imagesInfo'>
													The first image will be the cover (max 6).
												</p>
												<Form.Control
													// className='formInputFile'
													type='file'
													id='images'
													onChange={onMutate}
													max='6'
													accept='.jpg,.png,.jpeg'
													multiple
													required
												/>
											</Form.Group>
											<Button type='submit' variant="success" className="w-100">
												Create Listing
											</Button>
										</Form>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Card>
				</Container>
			</main>
		</div>
	);
}

export default CreateListing;
