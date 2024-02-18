import React from 'react'
import { Helmet } from 'react-helmet-async';
// import ogImg from 'public/opengraph-img.jpg';

function SEO({ title = 'UrbanVista' }) {
	return (
		<Helmet>
			{ /* Standard metadata tags */}
			<meta name="keywords" content="urbanvista, rent, sell, property, real estate" />
			<meta name="author" content="Dev Aryan" />
			<meta property="og:image" content="%PUBLIC_URL%/opengraph-img.jpg" />
			<meta property="og:description" content="Single platform for buying and selling real estate" />
			<meta name="twitter:description" content="Single platform for buying and selling real estate" />
			<meta name='description' content="Single platform for buying and selling real estate" />
			<meta name="twitter:creator" content="Dev Aryan" />
			<title>{title}</title>
			{ /* End standard metadata tags */}
			{ /* Facebook tags */}
			{/* <meta property="og:type" content={type} /> */}
			<meta property="og:title" content={title} />
			{ /* End Facebook tags */}
			{ /* Twitter tags */}
			<meta name="twitter:card" content="summary_large_image" />
			{/* <meta name="twitter:card" content={type} /> */}
			<meta name="twitter:title" content={title} />
			{ /* End Twitter tags */}
		</Helmet>
	)
}

export default SEO