import { useState } from "react";
import { Form, Button, FloatingLabel, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

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
      <header className="py-4 bg-light">
        <Container>
          <div className="">
            <h1>Forgot password</h1>
          </div>
        </Container>
      </header>
      <main className="py-5">
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
                onChange={onChangeHandler}
                placeholder="Email"
              />
            </FloatingLabel>
            <Link to="/sign-in" className="text-decoration-none text-end my-2">
              Sign In
            </Link>
            <div className="d-lg-block d-flex align-items-center justify-content-between">
              <p className="fw-bold mb-0 d-inline-block">Send reset link</p>
              <Button
                type="submit"
                className="rounded-circle text-center ms-sm-2"
              >
                <i className="bi bi-chevron-right"></i>
              </Button>
            </div>
          </Form>
        </Container>
      </main>
    </>
  );
}

export default ForgotPassword;
