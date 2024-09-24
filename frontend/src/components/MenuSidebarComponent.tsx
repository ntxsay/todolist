import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faBars,
    faMagnifyingGlass,
    faAnglesRight,
    faCalendarDay,
    faCalendarXmark,
    faCalendarCheck,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import React, {useState, useEffect} from "react";
import {ICategorySchemaWithCountTasks} from "../interfaces/ICategorySchema.tsx";
import {Link} from "react-router-dom";
interface MenuSidebarComponentProps {
   
    onCreateCategory: () => void;
    newCategory: ICategorySchemaWithCountTasks | null;
}

const MenuSidebarComponent:React.FC<MenuSidebarComponentProps> = (props) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState<ICategorySchemaWithCountTasks[]>([]);
    useEffect(() => {
        fetchCategories().then();
    }, []);

    useEffect(() => {
        console.log(props.newCategory);
        if (props.newCategory !== null && props.newCategory.category.id !== 0 && props.newCategory.category.name !== null && props.newCategory.category.name !== "") {
            setCategories([...categories, props.newCategory]);
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

    return (
        <aside id={"leftMainPanel"}>
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
                        <li className={"navigationItemSection_list_navigationItem selected"}>
                            <Link to={'/'}>
                                <FontAwesomeIcon icon={faAnglesRight}/>
                                <span>Bientôt</span>
                                <div className={"navigationItem_bagde"}>
                                    <span>10</span>
                                </div>
                            </Link>
                        </li>
                        <li className={"navigationItemSection_list_navigationItem"}>
                            <Link to={'/'}>
                                <FontAwesomeIcon icon={faCalendarDay}/>
                                <span>Aujourd'hui</span>
                                <div className={"navigationItem_bagde"}>
                                    <span>8</span>
                                </div>
                            </Link>
                        </li>
                        <li className={"navigationItemSection_list_navigationItem"}>
                            <Link to={'/'}>
                                <FontAwesomeIcon icon={faCalendarCheck}/>
                                <span>Passées</span>
                                <div className={"navigationItem_bagde"}>
                                    <span>11</span>
                                </div>
                            </Link>
                        </li>
                        <li className={"navigationItemSection_list_navigationItem"}>
                            <Link to={'/'}>
                                <FontAwesomeIcon icon={faCalendarXmark}/>
                                <span>Annulées</span>
                                <div className={"navigationItem_bagde"}>
                                    <span>0</span>
                                </div>
                            </Link>
                        </li>
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