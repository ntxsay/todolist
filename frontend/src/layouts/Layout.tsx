import {Outlet} from 'react-router-dom';
import MenuSidebarComponent from "../components/MenuSidebarComponent.tsx";
import EditCategoryModalComponent from "../components/EditCategoryModalComponent.tsx";
import {useState} from "react";
import {ICategorySchema, ITaskSchema} from "../interfaces/ICategorySchema.tsx";
import Modal from "react-modal";
import EditTaskSidebarComponent from "../components/EditTaskSidebarComponent.tsx";

Modal.setAppElement('#root');

const Layout = () => {

    const emptyCategory: ICategorySchema = {
        id: 0,
        name: "",
        color: "",
        description: undefined,
        createdAt: "",
        updatedAt: "",
        Tasks: []
    };
    
    const emptyTask: ITaskSchema = {
        id: 0,
        name: "",
        beginDate: "",
        endDate: "",
        description: undefined,
        categoryId: 0,
        createdAt: "",
        updatedAt: ""
    };
    
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [editCategoryModalModel, setEditCategoryModalModel] = useState<ICategorySchema>(emptyCategory);
    
    const [editTaskModalModel, setEditTaskModalModel] = useState<ITaskSchema>(emptyTask);
    const onOpenCreateCategoryModal = () => {
        setEditCategoryModalModel(emptyCategory);
        setIsEditCategoryModalOpen(true);
    }
    
    const onCategorySaved = (category: ICategorySchema) => {
        setEditCategoryModalModel(category);
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
                <EditTaskSidebarComponent isEdit={editCategoryModalModel.id !== 0} onCreateTask={() => {}} newTask={editTaskModalModel}/>
            </main>
            <EditCategoryModalComponent isOpen={isEditCategoryModalOpen} onCancelled={onCategoryEditionCancelled} onCategorySaved={onCategorySaved} model={editCategoryModalModel}
            isEdit={editCategoryModalModel.id !== 0}/>
        </>
    );
}

export default Layout;