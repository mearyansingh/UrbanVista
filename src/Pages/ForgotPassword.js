import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, FloatingLabel, Container, Image, Card } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Header from "Components/LayoutComponents/Header";
import urbanVista from "Assets/images/urbanVista.png";
import OAuth from "Components/OAuth";

function ForgotPassword() {

	/**Initial state */
	const [email, setEmail] = useState("");

	/**Function to handle input */
	const onChangeHandler = (e) => {
		setEmail(e.target.value);
	};

	/**Function to handle submit */
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, email);
			toast.success("Email was send");
		} catch (error) {
			toast.error("Could not send reset email");
		}
	}

	return (
		<>
			<Header>
				<h2 className="mb-0">Forgot password</h2>
			</Header>
			<main className="flex-grow-1 pt-25 mb-60 pb-40">
				<Container>
					<Row className="justify-content-center">
						<Col sm={12} md={9} lg={7} xl={6} xxl={5}>
							<Card className="border border-light-subtle rounded-4">
								<Card.Body className="p-15 p-md-25 p-xl-45">
									<Row >
										<Col>
											<div className="mb-45">
												<div className="text-center mb-25 ">
													<Link to="/">
														<Image src={urbanVista} fluid alt="UrbanVista_logo" width={150} height={150} />
													</Link>
												</div>
												<h2 className="h4 text-center">Password Reset</h2>
												<h3 className="fs-16 fw-normal text-body-secondary text-center m-0">Provide the email address associated with your account to recover your password.</h3>
											</div>
										</Col>
									</Row>
									<Form onSubmit={handleSubmit}>
										<Row className="gy-15">
											<Col sm={12}>
												<FloatingLabel
													controlId="email"
													label="Email"
													className="mb-15"
												>
													<Form.Control
														type="email"
														// id="email"
														value={email}
														onChange={onChangeHandler}
														placeholder="Email"
														required
														autoComplete="off"
													/>
												</FloatingLabel>
											</Col>
											<Col sm={12}>
												<div className="d-grid">
													<Button type="submit" variant="opacity-primary" size="lg">Send Reset Link</Button>
												</div>
											</Col>
										</Row>
									</Form>
									<Row>
										<Col>
											<hr className="mt-45 mb-25 border" />
											<div className="d-flex gap-5 gap-md-15 flex-column flex-md-row justify-content-md-end">
												<Link to="/sign-in">Sign in</Link>
												<Link to="/sign-up">Sign up</Link>
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

export default ForgotPassword;
