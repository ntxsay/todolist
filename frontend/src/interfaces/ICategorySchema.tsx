export interface ICategorySchema {
    id: number;
    name: string;
    color: string;
    description: string | undefined;
    createdAt: string;
    updatedAt: string;
    countTasks: number;
}

export interface ICategorySchemaWithCountTasks {
    countTasks: number;
    category: ICategorySchema;
}

export interface ICategorySchemaWithTasks {
    countTasks: number;
    category: ICategorySchema;
    tasks: ITaskSchema[];
}

export interface ITaskSchema {
    id: number;
    name: string;
    beginDate: string;
    endDate: string;
    description: string | undefined;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
}