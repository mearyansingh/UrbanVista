import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FloatingLabel, Form, Container, Button, Image, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile, } from "firebase/auth";
import { db } from "firebase.config";
import OAuth from "Components/OAuth";
import Header from 'Components/LayoutComponents/Header'
import urbanVista from "Assets/images/urbanVista.png";

function SignUp() {

	/**initial state */
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	/**state destructure */
	const { name, email, password } = formData;
	const navigate = useNavigate();

	// function is called on onChange
	const onHandleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	// function is called on onSubmit
	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;
			updateProfile(auth.currentUser, {
				displayName: name,
			});

			//copy the formData and removing the password field and set the database
			const formDataCopy = { ...formData };
			delete formDataCopy.password;
			formDataCopy.timestamp = serverTimestamp();
			await setDoc(doc(db, "users", user.uid), formDataCopy);
			navigate("/");
		} catch (error) {
			console.log(error)
			toast.error('Something went wrong with registration')
		}
	};

	return (
		<>
			<Header>
				<h2 className="mb-0">Welcome!</h2>
			</Header>
			<main className="flex-grow-1 pt-25 mb-60 pb-40">
				<Container>
					<Row className="justify-content-center">
						<Col sm={12} md={9} lg={7} xl={7} xxl={5}>
							<Card className="border border-light-subtle rounded-4">
								<Card.Body className="p-15 p-md-25 p-xl-45">
									<Row>
										<Col>
											<div className="mb-45">
												<div className="text-center mb-25">
													<Link to="/">
														<Image fluid src={urbanVista} alt="UrbanVista_logo" width={150} height={150} />
													</Link>
												</div>
												<h2 className="h4 text-center">Registration</h2>
												<p className="text-body-secondary text-center m-0">Enter your details to register</p>
											</div>
										</Col>
									</Row>
									<Form onSubmit={submitHandler}>
										<Row className="gy-15 overflow-hidden">
											<Col sm={12}>
												<FloatingLabel
													label="Enter name"
													className="mb-15"
													controlId="name"
												>
													<Form.Control
														type="text"
														// id="name"
														value={name}
														onChange={onHandleChange}
														placeholder="Name"
														required
														autoComplete="off"
													/>
												</FloatingLabel>
											</Col>
											<Col sm={12}>
												<FloatingLabel
													label="Email"
													className="mb-15"
													controlId="email"
												>
													<Form.Control
														type="email"
														// id="email"
														value={email}
														onChange={onHandleChange}
														placeholder="Email"
														required
														autoComplete="off"
													/>
												</FloatingLabel>
											</Col>
											<Col sm={12}>
												<FloatingLabel label="Password" controlId="password" className="mb-15">
													<Form.Control
														type={showPassword ? 'text' : 'password'}
														// id="password"
														value={password}
														onChange={onHandleChange}
														placeholder="Password"
														className="pe-5"
														required
														autoComplete="off"
													/>
													<span
														className={`position-absolute end-0 top-50 translate-middle cursor-pointer lh-1 fs-2 bi fs-18 ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}
														onClick={() => setShowPassword((prevState) => !prevState)}
													/>
												</FloatingLabel>
											</Col>
											<Col sm={12}>
												<div className="d-grid">
													<Button variant="opacity-primary" size="lg" type="submit">Sign up</Button>
												</div>
											</Col>
										</Row>
									</Form>
									<Row>
										<Col sm={12}>
											<hr className="mt-45 mb-25 border" />
											<p className="m-0 text-center text-body-secondary">Already have an account? <Link to="/sign-in">Sign in</Link></p>
										</Col>
									</Row>
									<Row className="mt-45">
										<Col sm={12}>
											<div className="d-flex justify-content-center">
												<OAuth />
											</div>
										</Col>
									</Row>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>
			</main>
		</>
	);
}

export default SignUp;
