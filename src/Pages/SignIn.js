import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, FloatingLabel, Container, Button, Row, Col, Card, Image } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import OAuth from "Components/OAuth";
import Header from "Components/LayoutComponents/Header";
import urbanVista from "Assets/images/urbanVista.png";


function SignIn() {

	/**initial state */
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	/**state destructure */
	const { email, password } = formData;

	/**Function to handle onChange action */
	const onHandleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	/**Function to handle onSubmit action */
	const handleSubmit = async (e) => {
		e.preventDefault();
		const auth = getAuth();

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (userCredential.user) {
				navigate("/");
			}
		} catch (error) {
			console.log(error);
			toast.error("Bad user credentials");
		}
	};

	return (
		<>
			<Header>
				<h2 className="mb-0">Welcome Back!</h2>
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
													<Link to='/'>
														<Image fluid src={urbanVista} alt="UrbanVista_logo" width={150} height={150} />
													</Link>
												</div>
												<h4 className="text-center">Welcome back you've been missed!</h4>
											</div>
										</Col>
									</Row>
									<Form onSubmit={handleSubmit}>
										<Row className="gy-15 overflow-hidden">
											<Col sm={12}>
												<FloatingLabel
													label="Email"
													className="mb-15"
												>
													<Form.Control
														type="email"
														id="email"
														value={email}
														onChange={onHandleChange}
														placeholder="Email"
														required
														autoComplete="off"
													/>
												</FloatingLabel>
											</Col>
											<Col sm={12}>
												<FloatingLabel label="Password" className="mb-15">
													<Form.Control
														id="password"
														placeholder="Password"
														className="pe-5"
														required
														value={password}
														onChange={onHandleChange}
														type={showPassword ? 'text' : 'password'}
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
													<Button variant="opacity-primary" size="lg" className="" type="submit">Sign in</Button>
												</div>
											</Col>
										</Row>
									</Form>
									<Row>
										<Col>
											<hr className="mt-45 mb-25 border" />
											<div className="d-flex gap-5 gap-md-25 flex-column flex-md-row justify-content-md-end">
												<Link to="/sign-up">Create new account</Link>
												<Link to="/forgot-password">Forgot Password</Link>
											</div>
										</Col>
									</Row>
									<Row className="mt-45">
										<Col>
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

export default SignIn;
