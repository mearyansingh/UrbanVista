import React from 'react'
import { Helmet } from 'react-helmet-async';
// import ogImg from 'public/opengraph-img.jpg';

function SEO({ title = 'UrbanVista' }) {
	const absoluteImagePath = "https://urbanvista.vercel.app/Assets/images/opengraph-img.jpg";

	return (
		<Helmet>
			{ /* Standard metadata tags */}
			<link rel='canonical' href="https://urbanvista.vercel.app/" />
			<meta name="keywords" content="urbanvista, rent, sell, property, real estate" />
			<meta name="author" content="Aryan Singh" />
			<title>{title}</title>
			<meta name='description' content="Single platform for buying and selling real estate" />
			{ /* Facebook tags */}
			{/* <meta property="og:type" content={type} /> */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content="Single platform for buying and selling real estate" />
			<meta property="og:image" content={absoluteImagePath} />
			<meta property="og:url" content="https://urbanvista.vercel.app/" />
			<meta property="og:type" content="website" />
			{ /* Twitter tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:description" content="Single platform for buying and selling real estate" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:image" content={absoluteImagePath} />
			<meta name="twitter:creator" content="Aryan Singh" />
			<meta property="twitter:url" content="https://urbanvista.vercel.app/" />
			{/* <meta name="twitter:card" content={type} /> */}
		</Helmet>
	)
}

export default SEO


