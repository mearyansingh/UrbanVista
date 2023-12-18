import React from "react";
import { Button, Image } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import {
	getAuth, signInWithPopup, GoogleAuthProvider
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";

function OAuth() {

	/**react-router-dom hook  */
	const navigate = useNavigate();
	const location = useLocation();

	/**Function to handle Google sign-in */
	const onGoogleClick = async () => {
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			//check for user
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			//if user doesn't exist,create user
			if (!docSnap.exists()) {
				await setDoc(docRef, {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			navigate("/");
		} catch (error) {
			toast.error("Could not authorize with Google");
		}
	};

	return (
		<>
			<div className="text-center d-block mb-4">
				<p className="mb-2">
					Sign {location.pathname === "/sign-up" ? "up" : "in"} with
				</p>
				<Button
					onClick={onGoogleClick}
					className="rounded-circle"
					variant="light"
					size="sm"
				>
					<Image fluid src={googleIcon} width={15} height={15} alt="google" />
				</Button>
			</div>
		</>
	);
}

export default OAuth;
