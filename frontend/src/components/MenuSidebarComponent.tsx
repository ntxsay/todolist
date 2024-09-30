import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faBars,
    faMagnifyingGlass,
    faAnglesRight,
    faCalendarDay,
    faCalendarCheck,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import React, {useState, useEffect} from "react";
import {ICategorySchema, ICategorySchemaWithCountTasks} from "../interfaces/ICategorySchema.tsx";
import {Link} from "react-router-dom";
import {IStatusSchema} from "../interfaces/IStatusSchema.tsx";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
interface MenuSidebarComponentProps {
   
    onCreateCategory: () => void;
    newCategory: ICategorySchema | null;
}

const MenuSidebarComponent:React.FC<MenuSidebarComponentProps> = (props) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState<ICategorySchemaWithCountTasks[]>([]);
    const [statusTasks, setStatusTasks] = useState<IStatusSchema[]>([]);
    const iconDictionary : { [key: string]: IconDefinition } = {
        "coming": faAnglesRight,
        "today": faCalendarDay,
        "past": faCalendarCheck
    };
    
    useEffect(() => {
        fetchCategories().then();
        fetchStatusTasks().then();
    }, []);

    useEffect(() => {
        console.log(props.newCategory);
        if (props.newCategory !== null && props.newCategory.id !== 0 && props.newCategory.name !== null && props.newCategory.name !== "") {
            setCategories([...categories, {category: props.newCategory, countTasks: 0}]);
        }
    }, [props.newCategory]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get<ICategorySchemaWithCountTasks[]>(`${apiUrl}/api/categories`);
            setCategories(response.data)
        } catch (error) {
            console.error(error);
        }
    }
    
    const fetchStatusTasks = async () => {
        try {
            const response = await axios.get<IStatusSchema[]>(`${apiUrl}/api/tasks/status`);
            setStatusTasks(response.data)
        } catch (error) {
            console.error(error);
        }
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
                            statusTasks.map((statusTask, index) => {
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
                            categories.map((category) => (
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
                            onClick={props.onCreateCategory}>
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Nouvelle catégorie</span>
                            </button>
                        </li>
                    </ul>
                </article>
            </div>
        </aside>
    );
}

export default MenuSidebarComponent;