import {useLocation, useNavigate, useOutletContext, useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ICategorySchema, ICategorySchemaWithCountTasks} from "../interfaces/ICategorySchema.tsx";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faPlus,
    faPen,
    faChevronRight,
    faTrashCan,
    faDeleteLeft
} from '@fortawesome/free-solid-svg-icons'
import EditTaskSidebarComponent from "../components/EditTaskSidebarComponent.tsx";
import DeleteMessageModalComponent from "../components/DeleteMessageModalComponent.tsx";
import {ITaskSchema} from "../interfaces/ITaskSchema.tsx";
import EditCategoryModalComponent from "../components/EditCategoryModalComponent.tsx";
import {IStatusSchema} from "../interfaces/IStatusSchema.tsx";

interface DeleteMessageModalProps {
    isOpen: boolean;
    message: string;
    title: string;
}

const TasksPage = () => {
    const emptyTask: ITaskSchema = {
        id: 0,
        name: "",
        beginDate: "",
        endDate: "",
        description: "",
        categoryId: 0,
        createdAt: "",
        updatedAt: ""
    };
    const past = "past";
    const coming = "coming";
    const today = "today";
    
    const navigate = useNavigate();
    const location = useLocation();
    const path: string = location.pathname;
    const {id} = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const [headerTitle, setHeaderTitle] = useState<string>("");
    const [selectedId, setSelectedId] = useState<number[]>([]);
    
    const [category, setCategory] = useState<ICategorySchema | null>(null);
    const [tasks, setTasks] = useState<ITaskSchema[]>([]);
    const [editTaskModalModel, setEditTaskModalModel] = useState<ITaskSchema>(emptyTask);
    
    const [isEditTaskSidebarOpen, setIsEditTaskSidebarOpen] = useState(false);
    const [deleteTaskModalParams, setDeleteTaskModalParams] = useState<DeleteMessageModalProps>({isOpen: false, message: "", title: ""});
    const [deleteCategoryModalParams, setDeleteCategoryModalParams] = useState<DeleteMessageModalProps>({isOpen: false, message: "", title: ""});
    const [isCategoryEditionModalOpen, setIsCategoryEditionModalOpen] = useState(false);

    const { categories, setCategories, statusTasks, setStatusTasks } = useOutletContext<{
        categories: ICategorySchemaWithCountTasks[];
        setCategories: (categories: ICategorySchemaWithCountTasks[]) => void;
        statusTasks: IStatusSchema[];
        setStatusTasks: (statusTasks: IStatusSchema[]) => void;
    }>();
    
    useEffect(() => {
        const status = searchParams.get('status');

        if (path === "/" || !status) {
            console.log("path");
            axios.get<ITaskSchema[]>(import.meta.env.VITE_API_URL + "/api/tasks/today")
                .then((response) => {
                    setTasks(response.data);
                    setHeaderTitle("Aujourd'hui");
                    setCategory(null);
                })
                .catch((error) => {
                    console.error(error);
                });
            
            return;
        }
        
        if (path.includes("/tasks/category/") && id !== "") {

            axios.get<ICategorySchema>(import.meta.env.VITE_API_URL + "/api/categories/" + id)
                .then((response) => {
                    setCategory(response.data);
                    setHeaderTitle(response.data.name);
                    setTasks(response.data.Tasks);
                })
                .catch((error) => {
                    console.error(error);
                });
            
            return;
        }

        axios.get<ITaskSchema[]>(import.meta.env.VITE_API_URL + "/api/tasks/" + status)
            .then((response) => {

                switch (status) {
                    case today:
                        setHeaderTitle("Aujourd'hui");
                        break;
                    case past:
                        setHeaderTitle("Passées");
                        break;
                    case coming:
                        setHeaderTitle("À venir");
                        break;
                    default:
                        setHeaderTitle("");
                        break;
                }
                setTasks(response.data);
                setCategory(null);
            })
            .catch((error) => {
                console.error(error);
            });
        
    }, [id, path, searchParams]);

    const onOpenCreateTaskSidebar = () => {
        setEditTaskModalModel(emptyTask);
        setIsEditTaskSidebarOpen(true);
    }

    const onOpenEditTaskSidebar = (task: ITaskSchema) => {
        setEditTaskModalModel(task);
        setIsEditTaskSidebarOpen(true);
    }
    
    const findStatusTaskName = (task: ITaskSchema) : string | null => {
        const dateNow = new Date();
        const dateBegin = new Date(task.beginDate);
        const dateEnd = new Date(task.endDate);
        
        if (isNaN(dateBegin.getTime()) || isNaN(dateEnd.getTime()))
            return null;
        
        if (dateEnd < dateNow)
            return past;
        
        if (dateBegin > dateNow)
            return coming;
        
        if (dateBegin >= new Date(new Date().setHours(0, 0, 0, 0)) && dateBegin <= new Date(new Date().setHours(23, 59, 59, 999)))
            return today;
        
        return null;
    }
            
            

    const onTaskSaved = (task: ITaskSchema) => {
        setEditTaskModalModel(task);
        setIsEditTaskSidebarOpen(false);

        const existingTask = tasks.find(t => t.id === task.id);
        const isNewTask = existingTask === undefined;
        
        if (isNewTask) {
            if (category !== null && category.id === task.categoryId)
                setTasks([...tasks, task]);
        } else {
            existingTask.name = task.name;
            existingTask.beginDate = task.beginDate;
            existingTask.endDate = task.endDate;
            existingTask.description = task.description;
        }
        
        if (!isNewTask)
            return;
        
        const statusTaskName = findStatusTaskName(task);
        if (statusTaskName === null)
            return;
        
        const status = statusTasks.find(statusTask => statusTask.name === statusTaskName);
        if (!status)
            return;
        
        status.countTasks++;
        setStatusTasks([...statusTasks]);
    }

    const onTaskEditionCancelled = () => {
        setEditTaskModalModel(emptyTask);
        setIsEditTaskSidebarOpen(false);
    }
    
    const onOpenDeleteTaskModal = () => {
        const message = selectedId.length === 1 
        ? "Êtes-vous sûr de vouloir supprimer la tâche \u00ab " + tasks.find(t => t.id === selectedId[0])?.name + " \u00bb ?" 
        : "Êtes-vous sûr de vouloir supprimer ces \u00ab " + selectedId.length + " tâches \u00bb ?";
        
        setDeleteTaskModalParams({isOpen: true, message: message, title: "Suppression de tâches"});
    }
    
    const onTasksDeletingCancelled = () => {
        setDeleteTaskModalParams({isOpen: false, message: "", title: ""});
    }
    
    const onTasksDeleted = () => {
        setDeleteTaskModalParams({isOpen: false, message: "", title: ""});
        if (selectedId.length === 0)
            return;
        
        Array.from(selectedId).forEach(id => {
            axios.delete(import.meta.env.VITE_API_URL + `/api/tasks/${id}`)
                .then((response) => {
                    if (response.status === 200) {
                        setSelectedId(selectedId.filter(i => i !== id));
                        const task = tasks.find(t => t.id === id);
                        if (task !== undefined)
                        {
                            const statusTaskName = findStatusTaskName(task);
                            if (statusTaskName === null)
                                return;

                            const status = statusTasks.find(statusTask => statusTask.name === statusTaskName);
                            if (!status || status.countTasks === 0)
                                return;
                            
                            status.countTasks--;
                            setStatusTasks([...statusTasks]);
                        }
                        
                        setTasks(tasks.filter(t => t.id !== id));
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
        
        setSelectedId([]);
    }
    
    const onTaskCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
        setSelectedId(e.target.checked
            ? [...selectedId, taskId]
            : selectedId.filter(id => id !== taskId));
    }

    const onTaskDeleted = (task: ITaskSchema) => {
        setEditTaskModalModel(emptyTask);
        setIsEditTaskSidebarOpen(false);

        if (category === null)
            return;
        setCategory({...category, Tasks: [...category.Tasks.filter(t => t.id !== task.id)]});
    }

    const onOpenCategoryEdition = () => {
        setIsCategoryEditionModalOpen(true);
    }
    
    const onCategorySaved = (category: ICategorySchema) => {
        setCategory(category);
        setIsCategoryEditionModalOpen(false);
        setHeaderTitle(category.name);
    }
    
    const onCategoryEditionCancelled = () => {
        setIsCategoryEditionModalOpen(false);
    }

    const onOpenDeleteCategoryModal = () => {
        if (category === null)
            return;

        setDeleteCategoryModalParams({isOpen: true, message: "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action supprimera toutes les tâches liées.", title: "Suppression de catégorie"});
    }

    const onCategoryDeleted = () => {
        setDeleteCategoryModalParams({isOpen: false, message: "", title: ""});
        if (category === null)
            return;

        axios.delete(import.meta.env.VITE_API_URL + `/api/categories/${category.id}`)
            .then((response) => {
                if (response.status === 200) {
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const onCategoryDeletingCancelled = () => {
        setDeleteCategoryModalParams({isOpen: false, message: "", title: ""});
    }

    return (
        <section id={"taskSection"} className={"contentMainPanel"}>
            <div className={"contentMainPanel_contentContainer"}>
                <div className={"contentMainPanel_header"}>
                    <h3 className={"contentMainPanel_header_title"}>{headerTitle}</h3>
                    <div className={"contentMainPanel_header_badge"}>
                        <span>{tasks?.length ?? 0}</span>
                    </div>
                    {
                        category !== null &&
                        <button title={"Supprimer la catégorie"} className={"contentMainPanel_header_button trashButton"}
                                onClick={onOpenDeleteCategoryModal}>
                            <FontAwesomeIcon icon={faDeleteLeft}/>
                        </button>
                    }
                    {
                        category !== null &&
                        <button title={"Modifier la catégorie"} className={"contentMainPanel_header_button editButton"}
                                onClick={onOpenCategoryEdition}>
                            <FontAwesomeIcon icon={faPen}/>
                        </button>
                        
                    }
                    <button title={"Supprimer les tâches sélectionnées"}
                        className={"contentMainPanel_header_button trashButton" + (selectedId.length === 0 ? " hideButton" : "")}
                        onClick={onOpenDeleteTaskModal}>
                        <FontAwesomeIcon icon={faTrashCan}/>
                    </button>
                </div>
                <div className={"contentMainPanel_content"}>
                    <button className={"newTaskButton"} onClick={onOpenCreateTaskSidebar}>
                        <FontAwesomeIcon icon={faPlus}/>
                        <span>Ajouter une nouvelle tâche</span>
                    </button>
                    <ul className={"taskList"}>
                        {
                            tasks.map((task) => (
                                <li key={task.id}>
                                    <input type={"checkbox"} value={task.id} id={`task_${task.id}`} onChange={(e) => onTaskCheckboxChange(e, task.id)}/>
                                    <label htmlFor={`task_${task.id}`}>{task.name}</label>
                                    <button className={"taskItem_editButton"}
                                            onClick={() => onOpenEditTaskSidebar(task)}>
                                        <FontAwesomeIcon icon={faChevronRight}/>
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            <EditTaskSidebarComponent isEdit={editTaskModalModel.id !== 0} isOpen={isEditTaskSidebarOpen}
                                      onCancelled={onTaskEditionCancelled} onTaskSaved={onTaskSaved}
                                      onTaskDeleted={onTaskDeleted} taskModel={editTaskModalModel}/>
            <DeleteMessageModalComponent isOpen={deleteTaskModalParams.isOpen} onCancelled={onTasksDeletingCancelled} onDeleted={onTasksDeleted} message={deleteTaskModalParams.message} title={deleteTaskModalParams.title} id={"deleteTaskModal"}/>
            <DeleteMessageModalComponent isOpen={deleteCategoryModalParams.isOpen} onCancelled={onCategoryDeletingCancelled} onDeleted={onCategoryDeleted} message={deleteCategoryModalParams.message} title={deleteCategoryModalParams.title} id={"deleteCategoryModal"}/>
            {
                category !== null &&
                <EditCategoryModalComponent isOpen={isCategoryEditionModalOpen} onCancelled={onCategoryEditionCancelled} onCategorySaved={onCategorySaved} model={category} isEdit={true} id={"categoryEditionModal2"}/>
            }
        </section>
    )
}

export default TasksPage;