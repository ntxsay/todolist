import {Link, Outlet} from 'react-router-dom';
import MenuSidebarComponent from "../components/MenuSidebarComponent.tsx";
import EditCategoryModalComponent from "../components/EditCategoryModalComponent.tsx";
import {useState} from "react";
import {ICategorySchema, ICategorySchemaWithCountTasks} from "../interfaces/ICategorySchema.tsx";
import Modal from "react-modal";

Modal.setAppElement('#root');

const Layout = () => {

    const emptyCategory: ICategorySchemaWithCountTasks = {
        category: {
            id: 0,
            name: "",
            color: "",
            description: undefined,
            createdAt: "",
            updatedAt: "",
            countTasks: 0
        },
        countTasks: 0
    };
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [editCategoryModalModel, setEditCategoryModalModel] = useState<ICategorySchemaWithCountTasks>(emptyCategory);
    
    const onOpenCreateCategoryModal = () => {
        setEditCategoryModalModel(emptyCategory);
        setIsEditCategoryModalOpen(true);
    }
    
    const onCategorySaved = (category: ICategorySchema) => {
        setEditCategoryModalModel({
            category: category,
            countTasks: 0
        });
        setIsEditCategoryModalOpen(false);
    }
    
    const onCategoryEditionCancelled = () => {
        setEditCategoryModalModel(emptyCategory);
        setIsEditCategoryModalOpen(false);
    }
    
    
    return (
        <>
            <header></header>
            <main>
                <MenuSidebarComponent onCreateCategory={onOpenCreateCategoryModal} newCategory={editCategoryModalModel}/>
                <Outlet/>
                <aside id={"rightMainPanel"}>
                <Link to={"/login"} className={"rightPanelLink"}>Login</Link>
                    <Link to={"/register"} className={"rightPanelLink"}>Register</Link>
                </aside>
            </main>
            <EditCategoryModalComponent isOpen={isEditCategoryModalOpen} onCancelled={onCategoryEditionCancelled} onCategorySaved={onCategorySaved} model={editCategoryModalModel.category}
            isEdit={editCategoryModalModel.category.id !== 0}/>

        </>
    );
}

export default Layout;