import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import Slider from "Components/Slider";
import rentCategoryImage from "Assets/images/rentCategoryImage.jpg";
import sellCategoryImage from "Assets/images/sellCategoryImage.jpg";
import Header from "Components/LayoutComponents/Header";
import SEO from "Components/SEO";

function Explore() {

	return (
		<>
			{/* <SEO title="Explore | UrbanVista" /> */}
			<Header>
				<h2 className="mb-0">Explore</h2>
			</Header >
			<main className="flex-grow-1 pt-15 mb-60 pb-40 ">
				<Container>
					{/* {Slider} */}
					<Slider />
					<p className='fw-semibold fs-18 mt-30'>Categories</p>
					<Row className="g-30 custom-animate-fadeup">
						<Col sm="6">
							<Card as={Link} to="/category/rent" className="overflow-hidden bg-dark text-white h-100 shadow-sm">
								<Card.Img src={rentCategoryImage} alt="Rent" className="overlay-img object-fit-cover h-100" />
								<Card.ImgOverlay className="d-flex align-items-center justify-content-center h-100" >
									<Card.Title as="p" className="fs-24 mb-0">Places for rent</Card.Title>
								</Card.ImgOverlay>
							</Card>
						</Col>
						<Col sm="6">
							<Card as={Link} to="/category/sell" className="overflow-hidden bg-dark text-white h-100 shadow-sm">
								<Card.Img src={sellCategoryImage} alt="Sell" className="overlay-img object-fit-cover h-100" />
								<Card.ImgOverlay className="d-flex align-items-center justify-content-center h-100" >
									<Card.Title as="p" className="fs-24 mb-0">Places for sell</Card.Title>
								</Card.ImgOverlay>
							</Card>
						</Col>
					</Row>
				</Container>
			</main>
		</ >
	);
}

export default Explore;
