/*
* Loader Component 
**/
import React, { Fragment } from "react";
import PropTypes from "prop-types";
// import { useSelector } from "react-redux";

const LoaderComponent = ({ loading, wrapperClass }) => {

	// const data = useSelector(store => store.loading);
	// const { showLoading, message } = data;

	return (
		<Fragment>
			{(loading) &&
				<div className={`custom-loader--v2 ${wrapperClass} `}>
					{/* {(message && (message !== '')) && <p>{message}</p>} */}
					<div className="loader position-relative">
						<div className="dot dot1"></div>
						<div className="dot dot2"></div>
						<div className="dot dot3"></div>
					</div>
				</div>
			}
		</Fragment>
	)
}

// default props
LoaderComponent.defaultProps = {
	loading: false,
	showLoading: true,
	message: '',
	wrapperClass: 'position-fixed-imp'
}
//prop types
LoaderComponent.propTypes = {
	loading: PropTypes.bool,
	showLoading: PropTypes.bool,
	message: PropTypes.string,
	wrapperClass: PropTypes.string
}

const Loader = LoaderComponent;

export { Loader };
