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

