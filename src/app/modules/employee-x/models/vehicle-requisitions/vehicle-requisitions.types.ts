export interface Category {
    id?: string;
    title?: string;
    slug?: string;
}

export interface VehicleRequisition {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    category?: string;
    duration?: number;
    startDate: string;
    endDate: string;
    requestComments: string;
    lineApprovedDate: string;
    financeApprovedDate: string;
    dateRequested: string;
    steps?: {
        order?: number;
        title?: string;
        subtitle?: string;
        content?: string;
    }[];
    totalSteps?: number;
    updatedAt?: number;
    featured?: boolean;
    progress?: {
        currentStep?: number;
        completed?: number;
    };
}
