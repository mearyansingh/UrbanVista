/**
 * Component which will be visible when there will be no data to show in lists.
 * wrapperClass:: prop for adding the class on the wrapper.
 * contentWrapperClass:: prop for adding the class on the content wrapper.
 * title:: prop for showing the title.
 * description:: prop for showing the description.
 */
import { PropTypes } from "prop-types";

function ListEmptyPlaceholder({ message, description, wrapperClass, contentWrapperClass, messageClass }) {
	return (
		<div className={`border border-2 border-dashed text-center py-30 py-sm-100 ${wrapperClass ? wrapperClass : ""}`}>
			<div className={`${contentWrapperClass ? contentWrapperClass : ""}`}>
				<i className="display-6 d-block mb-20 text-dark opacity-50 lh-1 bi bi bi-x-circle"></i>
				{message && message !== "" && <h5 className={`${messageClass} mb-0`}>{message}</h5>}
				{description && description !== "" && <p className="mb-0 fs-14 mt-15">{description}</p>}
			</div>
		</div>
	)
}

/** Default props values */
ListEmptyPlaceholder.defaultProps = {
	description: "",
	message: "",
	wrapperClass: "",
	contentWrapperClass: "w-40 mx-auto",
	messageClass: ""
};

/** Props types */
ListEmptyPlaceholder.propTypes = {
	message: PropTypes.string,
	description: PropTypes.string,
	wrapperClass: PropTypes.string,
	contentWrapperClass: PropTypes.string,
	messageClass: PropTypes.string
};

export { ListEmptyPlaceholder };
