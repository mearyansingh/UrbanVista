import React from 'react'
import { Helmet } from 'react-helmet-async';
// import ogImg from 'public/opengraph-img.jpg';

function SEO({ title = 'UrbanVista' }) {
	return (
		<Helmet>
			{ /* Standard metadata tags */}
			<meta name="keywords" content="urbanvista, rent, sell, property, real estate" />
			<meta name="author" content="Aryan Singh" />
			<title>{title}</title>
			<meta name='description' content="Single platform for buying and selling real estate" />
			{ /* Facebook tags */}
			{/* <meta property="og:type" content={type} /> */}
			<meta property="og:title" content={title} />
			<meta property="og:description" content="Single platform for buying and selling real estate" />
			<meta property="og:image" content="Assets/images/opengraph-img.jpg" />
			<meta property="og:url" content="https://urbanvista.vercel.app/" />
			<meta property="og:type" content="website" />
			{ /* Twitter tags */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:description" content="Single platform for buying and selling real estate" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:image" content="Assets/images/opengraph-img.jpg" />
			<meta name="twitter:creator" content="Aryan Singh" />
			<meta property="twitter:domain" content="urbanvista.vercel.app" />
			<meta property="twitter:url" content="https://urbanvista.vercel.app/" />
			{/* <meta name="twitter:card" content={type} /> */}
		</Helmet>
	)
}

export default SEO


