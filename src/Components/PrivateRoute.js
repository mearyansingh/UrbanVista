import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UseAuthStatus } from "Hooks/UseAuthStatus";
import Spinners from "./Spinners";

function PrivateRoute() {

	/**initial state */
	const { loggedIn, checkingStatus } = UseAuthStatus();

	if (checkingStatus) {
		return <Spinners />;
	}

	return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
