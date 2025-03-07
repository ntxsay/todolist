﻿import { Routes, Route } from "react-router-dom";
import TasksPage from "./pages/TasksPage.tsx";
import Layout from "./layouts/Layout.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="/tasks/category/:id" element={<TasksPage/>}/>
                <Route path="/tasks" element={<TasksPage/>}/>
                <Route index element={<TasksPage/>}/>
            </Route>
        </Routes>
    )
};

export default AppRoutes;