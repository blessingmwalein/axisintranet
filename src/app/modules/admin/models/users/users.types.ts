// export interface User
// {
//     id: string;
//     avatar?: string | null;
//     background?: string | null;
//     name: string;
//     emails?: {
//         email: string;
//         label: string;
//     }[];
//     phoneNumbers?: {
//         department: string;
//         phoneNumber: string;
//         label: string;
//     }[];
//     title?: string;
//     company?: string;
//     birthday?: string | null;
//     address?: string | null;
//     notes?: string | null;
//     tags: string[];
// }

export interface Department {
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag {
    id?: string;
    title?: string;
}


export interface User {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    departmentId: number;
    lineApprover: number;
    roles: string[];
    avatar?: string | null;
    background?: string | null;
    status?: string;
    tags: string[];
    phoneNumbers?: {
        department: string;
        phoneNumber: string;
        label: string;
    }[];
    emails?: {
        email: string;
        label: string;
    }[];
}
