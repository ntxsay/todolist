import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import React from "react";


interface DeleteMessageModalProps {
    isOpen: boolean;
    onCancelled: () => void;
    onDeleted: () => void;
    message: string;
    title: string;
    id: string;
}

const DeleteMessageModalComponent: React.FC<DeleteMessageModalProps> = (props) => {
    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={props.onCancelled}
            className="DeleteMessageModal"
            id={props.id}
            overlayClassName="Overlay">
            <div className="DeleteMessageModal__titleBar">
                <h2 className={"DeleteMessageModal__titleBar_title"}>{props.title}</h2>
                <button className={"DeleteMessageModal__titleBar_button"} onClick={props.onCancelled} aria-hidden="true" aria-label="Fermer">
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </div>
            <div className="DeleteMessageModal__content">
                <p className="DeleteMessageModal__content__message">{props.message}</p>
            </div>
            <div className="DeleteMessageModal__footer">
                <button className={"deleteButton"} onClick={props.onDeleted}>
                    <span>Supprimer</span>
                </button>
                <button className={"cancelButton"} onClick={props.onCancelled}>
                    <span>Annuler</span>
                </button>
            </div>
        </Modal>
    )
}

export default DeleteMessageModalComponent;