import {ICategorySchema, ITaskSchema} from "../interfaces/ICategorySchema.tsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons'

interface EditTaskSidebarComponentProps {
    isEdit: boolean;
    onCreateTask: () => void;
    newTask: ITaskSchema;
}

const EditTaskSidebarComponent: React.FC<EditTaskSidebarComponentProps> = (props) => {

    const [task, setTask] = useState<ITaskSchema>(props.newTask);
    const [categories, setCategories] = useState<ICategorySchema[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    useEffect(() => {
        axios.get<ICategorySchema[]>(`${import.meta.env.VITE_API_URL}/api/categories`)
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <aside id={"rightMainPanel"}>
            <form className={"taskFormEditor"}>
                <div className={"taskFormEditor__titleBar"}>
                    <h2 className={"taskFormEditor__titleBar_title"}>{props.isEdit ? "Modifier la tâche" : "Créer une tâche"}</h2>
                    <button className={"taskFormEditor__titleBar_button"} onClick={props.onCancelled}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>
                </div>
                <div className={"taskFormEditor__content"}>
                    <div className={"taskFormEditor_item taskFormEditor__name"}>
                        <label htmlFor={"taskName"}>Nom de la tâche</label>
                        <textarea wrap={"soft"} name={"taskName"} id={"taskName"} value={task.name}
                               placeholder={"Entrez le nom de la tâche"}
                               onChange={(e) => setTask({...task, name: e.target.value})} required/>
                    </div>
                    <div className={"taskFormEditor_item taskFormEditor__description"}>
                        <label htmlFor={"taskDescription"}>Description</label>
                        <textarea name={"taskDescription"} id={"taskDescription"} value={task.description}
                                  placeholder={"Entrez la description"}
                                  onChange={(e) => setTask({...task, description: e.target.value})}></textarea>
                    </div>
                    <div className={"taskFormEditor_item taskFormEditor__category"}>
                        <label htmlFor={"taskCategory"}>Catégorie</label>
                        <select name={"taskCategory"} id={"taskCategory"} value={task.categoryId}
                                onChange={(e) => setTask({...task, categoryId: Number(e.target.value)})}>
                            <option value={0}>Sélectionner une catégorie</option>
                            {
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={"taskFormEditor_item taskFormEditor__beginDate"}>
                        <label htmlFor={"taskBeginDate"}>Date de début</label>
                        <input type={"datetime-local"} name={"taskBeginDate"} id={"taskBeginDate"}
                               value={task.beginDate}
                               onChange={(e) => setTask({...task, beginDate: e.target.value})} required/>
                    </div>
                    <div className={"taskFormEditor_item taskFormEditor__endDate"}>
                        <label htmlFor={"taskEndDate"}>Date de fin</label>
                        <input type={"datetime-local"} name={"taskEndDate"} id={"taskEndDate"}
                               value={task.endDate}
                               onChange={(e) => setTask({...task, endDate: e.target.value})} required/>
                    </div>
                    <div
                        className={"taskFormEditor_item taskFormEditor__validation" + (errorMessage === "" ? "" : " --hasErrors")}>
                        <p>{errorMessage}</p>
                    </div>
                </div>
                <div className={"taskFormEditor__buttonBar"}>
                    <button type={"submit"} className={"taskFormEditor__buttonBar_saveButton"}>
                        <span>Enregistrer</span>
                    </button>
                    {
                        props.isEdit &&
                        <button onClick={props.onCreateTask} className={"taskFormEditor__buttonBar_deleteButton"}>
                            <span>Supprimer</span>
                        </button>
                    }
                </div>
            </form>
        </aside>
    )
}

export default EditTaskSidebarComponent;