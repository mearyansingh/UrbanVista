import { useState } from "react";
//firebase-Sign up new users
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import OAuth from "../Components/OAuth";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = (e) => {
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
      <header>
        <Container>
          <div className="py-3">
            <h1>Welcome Back!</h1>
          </div>
        </Container>
      </header>
      <main>
        <Container>
          <Form className="mb-2" onSubmit={submitHandler}>
            <FloatingLabel // controlId="floatingInput"
              label="Enter name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                id="name"
                value={name}
                onChange={onChange}
                placeholder="Name"
              />
            </FloatingLabel>
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
                className="position-absolute end-0 top-50 translate-middle"
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
              <p className="fw-bold mb-0 d-inline-block">Sign Up</p>
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
          <Link to="/sign-in" className="text-decoration-none text-center">
            Sign In Instead
          </Link>
        </Container>
      </main>
    </>
  );
}

export default SignUp;
