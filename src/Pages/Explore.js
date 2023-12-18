import React from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";

function Explore() {
	return (
		<>
			<header className="py-4 bg-light">
				<Container>
					<h1 className="mb-0 lh-1">Explore</h1>
				</Container>
			</header>
			<main className="py-5">
				<Container>
					{/* {Slider} */}
					<h5>Categories</h5>
					<Row>
						<Col>
							<Link to="/category/rent" className="text-decoration-none">
								<Image
									src={rentCategoryImage}
									fluid
									height={300}
									width={800}
									alt="rent"
									className="rounded"
									style={{ minHeight: '115px', height: '15vw', objectFit: 'cover' }}
								/>
								<p>Places for rent</p>
							</Link>
						</Col>
						<Col>
							<Link to="/category/sell" className="text-decoration-none">
								<Image
									src={sellCategoryImage}
									fluid
									height={300}
									width={800}
									alt="sell"
									className="rounded"
									style={{ minHeight: '115px', height: '15vw', objectFit: 'cover' }}
								/>
								<p>Places for sell</p>
							</Link>
						</Col>
					</Row>
				</Container>
			</main>
		</>
	);
}

export default Explore;
