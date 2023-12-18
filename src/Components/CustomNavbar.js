import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
// import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
// import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";

function CustomNavbar() {
  const navigate = useNavigate();
  const location = useLocation()

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <>
      <footer className="position-fixed bottom-0 start-0 end-0">
        <Container>
          <Navbar bg="" variant="">
            <Container>
              {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
              <Nav className="mx-auto">
                <Nav.Link className={`me-4 ${pathMatchRoute("/") ? 'text-success fw-bold' : ""}`} onClick={() => navigate("/")}>
                  <i className="bi bi-compass me-2"></i>Explore
                </Nav.Link>
                <Nav.Link className={`me-4 ${pathMatchRoute("/offers") ? 'text-success fw-bold' : ""}`} onClick={() => navigate("/offers")}>
                  <i className="bi bi-gift-fill me-2"></i>Offers
                </Nav.Link>
                <Nav.Link className={`${pathMatchRoute("/profile") ? 'text-success fw-bold' : ""}`} onClick={() => navigate("/profile")}>
                  <i className="bi bi-person-fill me-2"></i>Profile
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        </Container>
      </footer>
    </>
  );
}

export default CustomNavbar;
