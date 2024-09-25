import {ICategorySchema, ITaskSchema} from "../interfaces/ICategorySchema.tsx";
import React, {useEffect, useState} from "react";
import axios from "axios";

interface EditTaskSidebarComponentProps {
    isEdit: boolean;
    onCreateTask: () => void;
    newTask: ITaskSchema;
}

const EditTaskSidebarComponent:React.FC<EditTaskSidebarComponentProps> = (props) => {
    
    const [task, setTask] = useState<ITaskSchema>(props.newTask);
    const  [categories, setCategories] = useState<ICategorySchema[]>([]);
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
            <h2 className={"taskSection_title"}>{props.isEdit ? "Modifier la tâche" : "Créer une tâche"}</h2>
            <form className={"taskFormEditor"}>
                <div className={"taskFormEditor_item taskFormEditor__name"}>
                    <label htmlFor={"taskName"}>Nom de la tâche</label>
                    <input type={"text"} name={"taskName"} id={"taskName"} value={props.newTask.name}
                           onChange={(e) => setTask({...task, name: e.target.value})} required/>
                </div>
                <div className={"taskFormEditor_item taskFormEditor__description"}>
                    <label htmlFor={"taskDescription"}>Description</label>
                    <textarea name={"taskDescription"} id={"taskDescription"} value={props.newTask.description}
                              onChange={(e) => setTask({...task, description: e.target.value})}></textarea>
                </div>
                <div className={"taskFormEditor_item taskFormEditor__category"}>
                    <label htmlFor={"taskCategory"}>Catégorie</label>
                    <select name={"taskCategory"} id={"taskCategory"} value={props.newTask.categoryId}
                            onChange={(e) => setTask({...task, categoryId: Number(e.target.value)})}>
                        <option value={0}>Aucune</option>
                        {
                            categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className={"taskFormEditor_item taskFormEditor__beginDate"}>
                    <label htmlFor={"taskBeginDate"}>Date de début</label>
                    <input type={"date"} name={"taskBeginDate"} id={"taskBeginDate"} value={props.newTask.beginDate}
                           onChange={(e) => setTask({...task, beginDate: e.target.value})} required/>
                </div>
                <div className={"taskFormEditor_item taskFormEditor__endDate"}>
                    <label htmlFor={"taskEndDate"}>Date de fin</label>
                    <input type={"date"} name={"taskEndDate"} id={"taskEndDate"} value={props.newTask.endDate}
                           onChange={(e) => setTask({...task, endDate: e.target.value})} required/>
                </div>
                <div className={"taskFormEditor_item taskFormEditor__validation" + (errorMessage === "" ? "" : " --hasErrors")}>
                    <p>{errorMessage}</p>
                </div>
                <div className={"taskFormEditor_item taskFormEditor__buttonBar"}>
                    <button type={"submit"}>
                        <span>Enregistrer</span>
                    </button>
                    <button onClick={props.onCreateTask}>
                        <span>Annuler</span>
                    </button>
                    {
                        props.isEdit &&
                        <button onClick={props.onCreateTask}>
                            <span>Supprimer</span>
                        </button>
                    }
                </div>
            </form>
        </aside>
    )
}

export default EditTaskSidebarComponent;