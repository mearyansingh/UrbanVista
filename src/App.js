import { Fragment, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomNavbar from "Components/CustomNavbar";
import { Loader } from "Components/GlobalComponents/Loader";

// Routes
const Explore = lazy(() => import("Pages/Explore"));
const Offers = lazy(() => import("Pages/Offers"));
const Profile = lazy(() => import("Pages/Profile"));
const SignIn = lazy(() => import("Pages/SignIn"));
const SignUp = lazy(() => import("Pages/SignUp"));
const Category = lazy(() => import("Pages/Category"));
const ForgotPassword = lazy(() => import("Pages/ForgotPassword"));
const CreateListing = lazy(() => import("Pages/CreateListing"));
const EditListing = lazy(() => import("Pages/EditListing"));
const Listing = lazy(() => import("Pages/Listing"));
const Contact = lazy(() => import("Pages/Contact"));
const PrivateRoute = lazy(() => import("Components/PrivateRoute"));

function App() {
	return (
		<>
			<div className="d-flex flex-column min-vh-100">
				<Router>
					<Routes>
						<Route path="/" element={<Suspense fallback={<Loader loading />}><Explore /></Suspense>} />
						<Route path="/offers" element={<Suspense fallback={<Loader loading />}><Offers /></Suspense>} />
						<Route path="/profile" element={<Suspense fallback={<Loader loading />}><PrivateRoute /></Suspense>}>
							<Route path="/profile" element={<Suspense fallback={<Loader loading />}><Profile /></Suspense>} />
						</Route>
						<Route path="/sign-in" element={<Suspense fallback={<Loader loading />}><SignIn /></Suspense>} />
						<Route path="/sign-up" element={<Suspense fallback={<Loader loading />}><SignUp /></Suspense>} />
						<Route path="/forgot-password" element={<Suspense fallback={<Loader loading />}><ForgotPassword /></Suspense>} />
						<Route path="/category/:categoryName" element={<Suspense fallback={<Loader loading />}><Category /></Suspense>} />
						<Route path="/category/:categoryName/:listingId" element={<Suspense fallback={<Loader loading />}><Listing /></Suspense>} />
						<Route path="/create-listing" element={<Suspense fallback={<Loader loading />}><CreateListing /></Suspense>} />
						<Route path="/edit-listing/:listingId" element={<Suspense fallback={<Loader loading />}><EditListing /></Suspense>} />
						<Route path="/contact/:landlordId" element={<Suspense fallback={<Loader loading />}><Contact /></Suspense>} />
					</Routes>
					<CustomNavbar />
				</Router>
			</div >
			<ToastContainer icon={false} position="top-right" autoClose={5000} hideProgressBar newestOnTop rtl={false} pauseOnFocusLoss draggable={false} pauseOnHover transition={Flip} />
		</>
	);
}

export default App;
