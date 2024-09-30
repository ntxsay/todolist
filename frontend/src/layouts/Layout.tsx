import {Outlet} from 'react-router-dom';
import MenuSidebarComponent from "../components/MenuSidebarComponent.tsx";
import EditCategoryModalComponent from "../components/EditCategoryModalComponent.tsx";
import {useState} from "react";
import {ICategorySchema} from "../interfaces/ICategorySchema.tsx";
import Modal from "react-modal";

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
    
    const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
    const [editCategoryModalModel, setEditCategoryModalModel] = useState<ICategorySchema>(emptyCategory);
    
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
            <main>
                <MenuSidebarComponent onCreateCategory={onOpenCreateCategoryModal} newCategory={editCategoryModalModel}/>
                <Outlet/>
            </main>
            <EditCategoryModalComponent isOpen={isEditCategoryModalOpen} onCancelled={onCategoryEditionCancelled} onCategorySaved={onCategorySaved} model={editCategoryModalModel}
            isEdit={editCategoryModalModel.id !== 0} id={"categoryEditionModal"}/>
        </>
    );
}

export default Layout;