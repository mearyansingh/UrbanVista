import { useState } from "react";
//firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import OAuth from "../Components/OAuth";
// import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setformData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

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
      <header>
        <Container>
          <div className="py-3">
            <h1>Welcome Back!</h1>
          </div>
        </Container>
      </header>
      <main>
        <Container>
          <Form className="mb-2" onSubmit={handleSubmit}>
            <FloatingLabel // controlId="floatingInput"
              label="Email"
              className="mb-3"
            >
              <Form.Control
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                placeholder="Email"
              />
            </FloatingLabel>
            <FloatingLabel label="Password">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="pe-5"
              />
              <Image
                className="position-absolute end-0 top-50 translate-middle cursor-pointer"
                src={visibilityIcon}
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            </FloatingLabel>
            <Link
              to="/forgot-password"
              className="text-decoration-none text-end my-2"
            >
              Forgot Password
            </Link>
            <div className="d-lg-block d-flex align-items-center justify-content-between">
              <p className="fw-bold mb-0 d-inline-block">Sign In</p>
              <Button
                type="submit"
                className="rounded-circle text-center ms-sm-2"
              >
                <i className="bi bi-chevron-right"></i>
              </Button>
            </div>
          </Form>
          <OAuth />
          {/* Google OAuth */}
          <Link to="/sign-up" className="text-decoration-none text-center">
            Sign Up Instead
          </Link>
        </Container>
      </main>
    </>
  );
}

export default SignIn;
