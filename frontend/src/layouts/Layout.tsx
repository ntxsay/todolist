import {Outlet} from 'react-router-dom';
import MenuSidebarComponent from "../components/MenuSidebarComponent.tsx";
import {useEffect, useState} from "react";
import Modal from "react-modal";
import {IStatusSchema} from "../interfaces/IStatusSchema.tsx";
import axios from "axios";
import {ICategorySchemaWithCountTasks} from "../interfaces/ICategorySchema.tsx";

Modal.setAppElement('#root');

const Layout = () => {
    
    const [categories, setCategories] = useState<ICategorySchemaWithCountTasks[]>([]);
    const [statusTasks, setStatusTasks] = useState<IStatusSchema[]>([]);

    useEffect(() => {
        fetchCategories().then();
        fetchStatusTasks().then();
    }, []);
    
    const fetchCategories = async () => {
        try {
            const response = await axios.get<ICategorySchemaWithCountTasks[]>(`${import.meta.env.VITE_API_URL}/api/categories`);
            setCategories(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchStatusTasks = async () => {
        try {
            const response = await axios.get<IStatusSchema[]>(`${import.meta.env.VITE_API_URL}/api/tasks/count-status`);
            setStatusTasks(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main>
            <MenuSidebarComponent categories={categories} taskStatuses={statusTasks} setCategories={setCategories}
                                  setStatusTasks={setStatusTasks}/>
            <Outlet context={{categories, setCategories, statusTasks, setStatusTasks}}/>
        </main>
    );
}

export default Layout;