import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faBars,
    faMagnifyingGlass,
    faAnglesRight,
    faCalendarDay,
    faCalendarCheck,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import React, {useState} from "react";
import {ICategorySchema, ICategorySchemaWithCountTasks} from "../interfaces/ICategorySchema.tsx";
import {Link} from "react-router-dom";
import {IStatusSchema} from "../interfaces/IStatusSchema.tsx";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import EditCategoryModalComponent from "./EditCategoryModalComponent.tsx";
interface MenuSidebarComponentProps {
    categories: ICategorySchemaWithCountTasks[];
    setCategories: (categories: ICategorySchemaWithCountTasks[]) => void;
    taskStatuses: IStatusSchema[];
    setStatusTasks: (statusTasks: IStatusSchema[]) => void;
}

const MenuSidebarComponent:React.FC<MenuSidebarComponentProps> = (props) => {

    const emptyCategory: ICategorySchema = {
        id: 0,
        name: "",
        color: "",
        description: undefined,
        createdAt: "",
        updatedAt: "",
        Tasks: []
    };
    
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [editCategoryModalModel, setEditCategoryModalModel] = useState<ICategorySchema>(emptyCategory);
    
    const iconDictionary : { [key: string]: IconDefinition } = {
        "coming": faAnglesRight,
        "today": faCalendarDay,
        "past": faCalendarCheck
    };
    
    
    const onOpenCreateCategoryModal = () => {
        setEditCategoryModalModel(emptyCategory);
        setIsEditCategoryModalOpen(true);
    }

    const onCategorySaved = (category: ICategorySchema) => {
        setEditCategoryModalModel(category);
        props.setCategories([...props.categories, {
            category: category, 
            countTasks: 0
        }]);
        setIsEditCategoryModalOpen(false);
    }

    const onCategoryEditionCancelled = () => {
        setEditCategoryModalModel(emptyCategory);
        setIsEditCategoryModalOpen(false);
    }
    
    return (
        <aside id={"leftMainPanel"} >
            <div className={"leftMainPanel_menuContainer"}>
                <h1>My Todo List</h1>
                <button>
                    <FontAwesomeIcon icon={faBars}/>
                </button>
            </div>
            <form className={"leftMainPanel_searchFormContainer"}>
                <button type={"submit"}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
                <label htmlFor={"searchInput"}>Search</label>
                <input type={"text"} placeholder={"Search"} name={"searchInput"} id={"searchInput"}/>
            </form>
            <div className={"leftMainPanel_navigationContainer"}>
                <article id={"tasksContainer"} className={"leftMainPanel_navigationContainer_navigationItemSection"}>
                    <h2 className={"navigationItemSection_title"}>Tâches</h2>
                    <ul className={"navigationItemSection_list"}>
                        {
                            props.taskStatuses.map((statusTask, index) => {
                                const icon = iconDictionary[statusTask.name];
                                if (!icon)
                                    return;

                                return (
                                    <li className={"navigationItemSection_list_navigationItem"} key={index}>
                                        <Link to={`/tasks?status=${statusTask.name}`}>
                                            <FontAwesomeIcon icon={icon}/>
                                            <span>{statusTask.displayName}</span>
                                            <div className={"navigationItem_bagde"}>
                                                <span>{statusTask.countTasks}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </article>
                <article id={"categoriesContainer"}
                         className={"leftMainPanel_navigationContainer_navigationItemSection"}>
                    <h2 className={"navigationItemSection_title"}>Catégories</h2>
                    <ul className={"navigationItemSection_list"}>
                        {
                            props.categories.map((category) => (
                                <li className={"navigationItemSection_list_navigationItem"} key={category.category.id}>
                                    <Link to={`/tasks/category/${category.category.id}`}>
                                        <div className={"categoryColor"}
                                             style={{backgroundColor: category.category.color}}></div>
                                        <span>{category.category.name}</span>
                                        <div className={"navigationItem_bagde"}>
                                            <span>{category.countTasks}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        }
                        <li className={"navigationItemSection_list_navigationItem"}>
                            <button className={"navigationItemSection_list_navigationItem_button"}
                            onClick={onOpenCreateCategoryModal}>
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Nouvelle catégorie</span>
                            </button>
                        </li>
                    </ul>
                </article>
            </div>
            <EditCategoryModalComponent isOpen={isEditCategoryModalOpen} onCancelled={onCategoryEditionCancelled} onCategorySaved={onCategorySaved} model={editCategoryModalModel}
                                        isEdit={editCategoryModalModel.id !== 0} id={"createCategoryModal"}/>
        </aside>
    );
}

export default MenuSidebarComponent;