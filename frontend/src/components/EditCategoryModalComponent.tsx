﻿import Modal from 'react-modal';
import React, {useState} from "react";
import {ICategorySchema} from "../interfaces/ICategorySchema.tsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

interface EditCategoryModalProps {
    isOpen: boolean;
    isEdit: boolean;
    onCategorySaved: (category: ICategorySchema) => void;
    onCancelled?: () => void;
    model: ICategorySchema;
}

const EditCategoryModalComponent: React.FC<EditCategoryModalProps> = (props) => {
    const [category, setCategory] = useState<ICategorySchema>(props.model);
    const [messageError, setMessageError] = useState<string>("");
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (category.name === null || category.name === "") {
            setMessageError("Le nom de la catégorie est obligatoire");
            return;
        }

        const regex = /^\s*$/;
        if (regex.test(category.name)) {
            setMessageError("Le nom de la catégorie ne peut pas contenir que des espaces blancs");
            return;
        }

        if (category.description !== undefined && regex.test(category.description)) {
            setMessageError("La description ne peut pas contenir que des espaces blancs");
            return;
        }

        axios.post(import.meta.env.VITE_API_URL + "/api/categories", category)
            .then((response) => {
                if (response.status === 201) {
                    props.onCategorySaved(response.data);
                    setCategory(props.model);
                }
            })
            .catch((error) => {
                console.error(error);
                setMessageError(error.response.data.message);
            });
    }

    const onCancel = () => {
        props.onCancelled?.();
        setCategory(props.model);
    }
    return (
        <Modal
            isOpen={props.isOpen}
            onRequestClose={props.onCancelled}
            className="CategoryEditionModal"
            id="EditCategoryModal"
            overlayClassName="Overlay">
            <form id={"categoryForm"} onSubmit={onSubmit} className="CategoryEditionModal__form">
                <div className="CategoryEditionModal__titleBar">
                    <h2 className={"CategoryEditionModal__titleBar_title"}>{props.isEdit ? "Modifier la catégorie" : "Créer une catégorie"}</h2>
                    <button className={"CategoryEditionModal__titleBar_button"} onClick={props.onCancelled}
                            aria-hidden="true" aria-label="Fermer">
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>

                <div className="CategoryEditionModal__content">
                    <div className="CategoryEditionModal__form_item form__name">
                        <label htmlFor="name">Nom de la catégorie</label>
                        <input type="text" name="name" id="name" value={category.name}
                               onChange={(e) => setCategory({...category, name: e.target.value})} required/>
                    </div>
                    <div className="CategoryEditionModal__form_item form__description">
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" value={category.description}
                                  onChange={(e) => setCategory({...category, description: e.target.value})}></textarea>
                    </div>
                    <div className="CategoryEditionModal__form_item form__color">
                        <label htmlFor="color">Couleur</label>
                        <input type="color" name="color" id="color" value={category.color}
                               onChange={(e) => setCategory({...category, color: e.target.value})} required/>
                    </div>
                    <div className={"CategoryEditionModal__form_validation" + (messageError === "" ? "" : " --hasErrors")}>
                        <p>{messageError}</p>
                    </div>
                    <div className="CategoryEditionModal__footer">
                        <button type="submit" className={"saveButton"}>
                            <span>Sauvegarder</span>
                        </button>
                        <button onClick={onCancel} className={"cancelButton"}>
                            <span>Annuler</span>
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    )
        ;
}

export default EditCategoryModalComponent;