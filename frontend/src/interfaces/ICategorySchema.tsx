import {ITaskSchema} from "./ITaskSchema.tsx";

export interface ICategorySchema {
    id: number;
    name: string;
    color: string;
    description: string | undefined;
    createdAt: string;
    updatedAt: string;
    Tasks: ITaskSchema[];
}

export interface ICategorySchemaWithCountTasks {
    countTasks: number;
    category: ICategorySchema;
}