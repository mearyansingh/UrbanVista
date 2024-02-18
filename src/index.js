import React from "react";
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css';
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from "./reportWebVitals";
import './Assets/style';
import 'swiper/swiper-bundle.css'
import { auth, db } from "./firebase.config";
import { HelmetProvider } from 'react-helmet-async';
import SEO from "Components/SEO";

const root = createRoot(document.getElementById("root"));
const helmetContext = {};
root.render(
	<React.StrictMode>
		<HelmetProvider context={helmetContext}>
			<SEO />
			<App />
		</HelmetProvider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
