import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import { ICategorySchema} from "../interfaces/ICategorySchema.tsx";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faPen,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const TasksPage = () => {

    const location = useLocation();
    const path: string  = location.pathname;
    const { id } = useParams<{ id: string }>();
    const [headerTitle, setHeaderTitle] = useState<string>("Aujourd'hui");
    //const [tasks, setTasks] = useState<string[]>([]);
    const [countTasks, setCountTasks] = useState<number>(0);
    const [category, setCategory] = useState<ICategorySchema | null>(null);
    useEffect(() => {
        if (path.includes("/tasks/category/") && id !== "") {
            
            axios.get<ICategorySchema>(import.meta.env.VITE_API_URL + "/api/categories/" + id)
                .then((response) => {
                    setCategory(response.data);
                    setHeaderTitle(response.data.name);
                    setCountTasks(response.data.Tasks.length);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    return (
        <section id={"taskSection"} className={"contentMainPanel"}>
            <div className={"contentMainPanel_header"}>
                <h3 className={"contentMainPanel_header_title"}>{headerTitle}</h3>
                <div className={"contentMainPanel_header_badge"}>
                    <span>{countTasks}</span>
                </div>
                <div className={"contentMainPanel_header_badge"}>
                    <FontAwesomeIcon icon={faPen} />
                </div>
            </div>
            <div className={"contentMainPanel_content"}>
                <button className={"newTaskButton"}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Ajouter une nouvelle tâche</span>
                </button>
                <ul className={"taskList"}>
                    <li>
                        <input type={"checkbox"} id={"task1"}/>
                        <label htmlFor={"task1"}>Tâche 1</label>
                        <button className={"taskItem_editButton"}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </li>
                    {
                        category?.Tasks.map((task) => (
                            <li key={task.id}>
                                <input type={"checkbox"} value={task.id} id={`task_${task.id}`}/>
                                <label htmlFor={`task_${task.id}`}>{task.name}</label>
                                <button className={"taskItem_editButton"}>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </section>
    )
}

export default TasksPage;