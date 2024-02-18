/**
 * Confirmation Popup Component 
 **/
import { Fragment } from "react"
import PropTypes from "prop-types"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const ConfirmPopup = ({ message, callback, popupRef, submitBtnText, cancelBtnText, icon, title, description, iconWrapper }) => {

	let data = null;
	if (popupRef && popupRef?.current?.data) {
		data = popupRef.current?.data?.current
	}

	return (
		<Fragment>
			<Modal.Body className="custom-popup__content">
				<div className="d-flex flex-column flex-sm-row text-center text-sm-start">
					<div className={`custom-popup__icon rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mx-auto mb-20 mb-sm-0 ${iconWrapper}`}>
						<i className={`fs-20 ${icon}`}></i>
					</div>
					<div className="ms-sm-15 flex-grow-1">
						{title !== "" && <h5 className="text-capitalize">{`${title} ${data?.name && data.name}`}</h5>}
						{message !== "" && <p className="mb-0 fs-17">{message}</p>}
						{(description !== "") && <p className="mb-0 mt-10">{description}</p>}
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer className="custom-popup__footer gap-10 gap-sm-20 flex-column-reverse flex-sm-row">
				<Button type="button" variant="white" size="sm" onClick={() => callback(false)}>{cancelBtnText}</Button>
				<Button type="button" variant="primary" size="sm" onClick={() => callback(true, data?.id)}>{submitBtnText}</Button>
			</Modal.Footer>
		</Fragment>
	)
}

// props validation
ConfirmPopup.propTypes = {
	callback: PropTypes.func.isRequired,   // callback is a function which fire the action when the user press the yes/no button
	message: PropTypes.string.isRequired,  // message ia a string that passed to display the text.
	description: PropTypes.string,
	submitBtnText: PropTypes.string,
	cancelBtnText: PropTypes.string,
	popupRef: PropTypes.object,
	icon: PropTypes.string,
	title: PropTypes.string,
	iconWrapper: PropTypes.string
};

ConfirmPopup.defaultProps = {
	submitBtnText: "Yes",
	cancelBtnText: "Cancel",
	description: "",
	message: "",
	icon: "bi bi-exclamation-triangle",
	title: "",
	iconWrapper: "custom-popup__icon--danger"
}

export { ConfirmPopup };
