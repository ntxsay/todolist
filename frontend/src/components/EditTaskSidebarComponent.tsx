import {ICategorySchemaWithCountTasks, ITaskSchema} from "../interfaces/ICategorySchema.tsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faXmark
} from '@fortawesome/free-solid-svg-icons'

interface EditTaskSidebarComponentProps {
    isOpen: boolean;
    isEdit: boolean;
    onCancelled: () => void;
    onTaskSaved: (task: ITaskSchema) => void;
    onTaskDeleted: (task: ITaskSchema) => void;
    taskModel: ITaskSchema;
}

const EditTaskSidebarComponent: React.FC<EditTaskSidebarComponentProps> = (props) => {

    console.log(props)
    const [task, setTask] = useState<ITaskSchema>(props.taskModel);

    const [categories, setCategories] = useState<ICategorySchemaWithCountTasks[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    
    useEffect(() => {
        axios.get<ICategorySchemaWithCountTasks[]>(`${import.meta.env.VITE_API_URL}/api/categories`)
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => {
                console.error(error);
            });
        
    }, []);
    
    useEffect(() => {
        setTask({...props.taskModel, beginDate: new Date(props.taskModel.beginDate).toISOString().slice(0, 16), endDate: new Date(props.taskModel.endDate).toISOString().slice(0, 16)});
    }, [props.taskModel]);

    
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (task.name === null || task.name === "") {
            setErrorMessage("Le nom de la tâche ne peut pas être vide");
            return;
        }

        const regex = /^\s*$/;
        if ( regex.test(task.name) ) {
            setErrorMessage("Le nom de la tâche ne peut pas contenir que des espaces blancs");
            return;
        }
        
        if (task.description !== undefined && regex.test(task.description)) {
            setErrorMessage("La description ne peut pas contenir que des espaces blancs");
            return;
        }
        
        if (task.beginDate === null || task.beginDate === "") {
            setErrorMessage("La date de début ne peut pas être vide");
            return;
        }
        
        if (task.endDate === null || task.endDate === "") {
            setErrorMessage("La date de fin ne peut pas être vide");
            return;
        }
        
        if (task.beginDate > task.endDate) {
            setErrorMessage("La date de début doit être inférieure à la date de fin");
            return;
        }
        
        if (task.beginDate === task.endDate) {
            setErrorMessage("La date de début et la date de fin ne peuvent pas être identiques");
            return;
        }
        
        if (task.categoryId === 0) {
            setErrorMessage("Vous devez sélectionner une catégorie");
            return;
        }
        
        if (task.id <= 0) {
            axios.post(import.meta.env.VITE_API_URL + "/api/tasks", task)
                .then((response) => {
                    if (response.status === 201) {
                        props.onTaskSaved(task);
                        setTask(props.taskModel);
                        setErrorMessage("");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage(error.response.data.message);
                });
        }
        else {
            axios.put(import.meta.env.VITE_API_URL + "/api/tasks/" + task.id, task)
                .then((response) => {
                    if (response.status === 200) {
                        props.onTaskSaved(task);
                        setTask(props.taskModel);
                        setErrorMessage("");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setErrorMessage(error.response.data.message);
                });
        }
        
    }
    
    const onDelete = () => {
        axios.delete(import.meta.env.VITE_API_URL + `/api/tasks/${task.id}`)
        .then((response) => {
            if (response.status === 200) {
                props.onTaskDeleted(task);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <aside id={"rightMainPanel"} className={(props.isOpen ? " --isOpen" : "")}>
            <form className={"taskFormEditor"} onSubmit={onSubmit}>
                <div className={"taskFormEditor__titleBar"}>
                    <h2 className={"taskFormEditor__titleBar_title"}>{props.isEdit ? "Modifier la tâche" : "Créer une tâche"}</h2>
                    <button className={"taskFormEditor__titleBar_button"} onClick={props.onCancelled} title={"Annuler"}>
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
                                    <option key={category.category.id} value={category.category.id}>{category.category.name}</option>
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
                        className={"taskFormEditor__validation" + (errorMessage === "" ? "" : " --hasErrors")}>
                        <p>{errorMessage}</p>
                    </div>
                </div>
                <div className={"taskFormEditor__buttonBar"}>
                    <button type={"submit"} className={"taskFormEditor__buttonBar_saveButton"}>
                        <span>Enregistrer</span>
                    </button>
                    {
                        props.isEdit &&
                        <button onClick={onDelete} className={"taskFormEditor__buttonBar_deleteButton"}>
                            <span>Supprimer</span>
                        </button>
                    }
                </div>
            </form>
        </aside>
    )
}

export default EditTaskSidebarComponent;