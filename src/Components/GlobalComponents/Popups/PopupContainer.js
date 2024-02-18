/**
 * Popup Container Component
 */
import React, { useState, useRef, useImperativeHandle } from "react";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

function PopupContainerComponent({ size, children, title, dialogClassName, className, subTitle, titleClass, onClose, isHeader, ...rest }, ref) {

	/** state initialization */
	const [isModalVisible, setModalVisibility] = useState(false);

	/** stateless variables */
	const data = useRef(null);

	/** Function to show Modal */
	const showModal = (popupData) => {
		data.current = popupData;
		setModalVisibility(true);
	}

	/** 
	 * Function is used to hide the Modal
	 */
	const closeModal = (isOnCloseCalled) => {
		data.current = null;
		setModalVisibility(false);
		if (onClose && isOnCloseCalled) { onClose(); }
	}

	/**
	 * Function is called while closing modal
	 */
	const onCloseModal = () => {
		closeModal(onClose ? true : false);
	}

	/**
	 * Imperative handler to declare the accessible function inside components using refs
	 */
	useImperativeHandle(ref, () => ({
		showModal,
		closeModal,
		data
	}));

	return (
		<Modal
			show={isModalVisible}
			onHide={onCloseModal}
			centered={true}
			dialogClassName={`custom-popup mx-auto ${dialogClassName} ${size === 'xl' ? 'custom-popup--xl mw-100' : ''}`}
			className={`${className}`}
			size={(size && (size !== 'xl')) ? size : ''}
			enforceFocus={false}
			autoFocus={false}
			restoreFocus={false}
			{...rest}
		>
			{isHeader &&
				<Modal.Header closeButton className={`${title && title !== '' ? "custom-popup__header" : ""}`}>
					<div>
						{title && title !== '' && <Modal.Title className={titleClass}>{title}</Modal.Title>}
						{subTitle && subTitle !== '' && <small>{subTitle}</small>}
					</div>
				</Modal.Header>
			}
			{children}
		</Modal>
	)
}

// Must forward refs before declaring the defaultProps and propTypes
const PopupContainer = React.forwardRef(PopupContainerComponent);

PopupContainer.defaultProps = {
	dialogClassName: 'custom-popup--sm',
	contentClassName: '',
	className: '',
	isHeader: false
};

PopupContainerComponent.propTypes = {
	dialogClassName: PropTypes.string,
	contentClassName: PropTypes.string,
	className: PropTypes.string,
	isHeader: PropTypes.bool,
	subTitle: PropTypes.string,
	size: PropTypes.string,
	children: PropTypes.node,
	title: PropTypes.string,
	onClose: PropTypes.bool,
	titleClass: PropTypes.string,
};

export { PopupContainer }
