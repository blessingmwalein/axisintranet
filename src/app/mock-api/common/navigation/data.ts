/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'employee',
        title: 'Employee',
        subtitle: 'Employee Pages',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'employee.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/axis/employee/dashboard',
            },
            {
                id: 'employee.calendar',
                title: 'Calendar',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/axis/employee/calendar',
            },
            {
                id: 'employee.announcements',
                title: 'Announcements',
                type: 'basic',
                icon: 'heroicons_outline:bell',
                link: '/axis/employee/announcements',
            },
            // {
            //     id   : 'employee.nortifications',
            //     title: 'Nortifications',
            //     type : 'basic',
            //     icon : 'heroicons_outline:bell',
            //     link : '/axis/employee/nortifications'
            // },
            {
                id: 'employee.requisitions',
                title: 'Requisitions',
                type: 'collapsable',
                icon: 'heroicons_outline:support',
                children: [
                    {
                        id: 'employee.requisitions.cash',
                        title: 'Cash',
                        type: 'basic',
                        link: '/axis/requsitions/cash',
                    },
                    {
                        id: 'employee.requisitions.card',
                        title: 'Card',
                        type: 'basic',
                        link: '/axis/requsitions/card',
                    },
                    {
                        id: 'employee.requisitions.device',
                        title: 'Promotional Materials',
                        type: 'basic',
                        link: '/axis/requsitions/device',
                    },
                    {
                        id: 'employee.requisitions.vehicle',
                        title: 'Vehicle',
                        type: 'basic',
                        link: '/axis/requsitions/vehicle',
                    },
                    {
                        id: 'employee.requisitions.asset',
                        title: 'Asset',
                        type: 'basic',
                        link: '/axis/requsitions/asset',
                    },
                ],
            },
        ],
    },
];

export const managerNavigation: FuseNavigationItem[] = [
    {
        id: 'manager',
        title: 'Finance Manager',
        subtitle: 'Finance Manager Pages',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'manager.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/axis/manager/dashboard',
            },
            {
                id: 'manager.announcements',
                title: 'Announcements',
                type: 'basic',
                icon: 'heroicons_outline:bell',
                link: '/axis/manager/announcements',
            },
            {
                id: 'manager.calendar',
                title: 'Calendar',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/axis/manager/calendar',
            },
            {
                id: 'manager.requisitions',
                title: 'Requisitions',
                type: 'collapsable',
                icon: 'heroicons_outline:support',
                children: [
                    {
                        id: 'manager.requisitions.cash',
                        title: 'Cash',
                        type: 'basic',
                        link: '/axis/requsitions/cash',
                    },
                    {
                        id: 'manager.requisitions.card',
                        title: 'Card',
                        type: 'basic',
                        link: '/axis/requsitions/card',
                    },
                    {
                        id: 'manager.requisitions.device',
                        title: 'Promotional Materials',
                        type: 'basic',
                        link: '/axis/requsitions/device',
                    },
                    {
                        id: 'manager.requisitions.vehicle',
                        title: 'Vehicle',
                        type: 'basic',
                        link: '/axis/requsitions/vehicle',
                    },
                    {
                        id: 'manager.requisitions.asset',
                        title: 'Asset',
                        type: 'basic',
                        link: '/axis/requsitions/asset',
                    },
                ],
            },
        ],
    },
];
export const financeManagerNavigation: FuseNavigationItem[] = [
    {
        id: 'finance-manager',
        title: 'Director Finance',
        subtitle: 'Director Finance Pages',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'finance-manager.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/axis/finance-manager/dashboard',
            },
            {
                id: 'finance-manager.announcements',
                title: 'Announcements',
                type: 'basic',
                icon: 'heroicons_outline:bell',
                link: '/axis/finance-manager/announcements',
            },
            {
                id: 'finance-manager.calendar',
                title: 'Calendar',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/axis/finance-manager/calendar',
            },
            {
                id: 'finance-manager.requisitions',
                title: 'Requisitions',
                type: 'collapsable',
                icon: 'heroicons_outline:support',
                children: [
                    {
                        id: 'employee.requisitions.cash',
                        title: 'Cash',
                        type: 'basic',
                        link: '/axis/requsitions/cash',
                    },
                    {
                        id: 'employee.requisitions.card',
                        title: 'Card',
                        type: 'basic',
                        link: '/axis/requsitions/card',
                    },
                    {
                        id: 'employee.requisitions.device',
                        title: 'Promotional Materials',
                        type: 'basic',
                        link: '/axis/requsitions/device',
                    },
                    {
                        id: 'employee.requisitions.vehicle',
                        title: 'Vehicle',
                        type: 'basic',
                        link: '/axis/requsitions/vehicle',
                    },
                    {
                        id: 'employee.requisitions.asset',
                        title: 'Asset',
                        type: 'basic',
                        link: '/axis/requsitions/asset',
                    },
                ],
            },
        ],
    },
];
export const gMNavigation: FuseNavigationItem[] = [
    {
        id: 'g-m',
        title: 'Managing Director',
        subtitle: 'Managing Director Pages',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'g-m.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/axis/g-m/dashboard',
            },
            {
                id: 'g-m.announcements',
                title: 'Announcements',
                type: 'basic',
                icon: 'heroicons_outline:bell',
                link: '/axis/g-m/announcements',
            },
            {
                id: 'g-m.calendar',
                title: 'Calendar',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/axis/g-m/calendar',
            },
            {
                id: 'g-m.requisitions',
                title: 'Requisitions',
                type: 'collapsable',
                icon: 'heroicons_outline:support',
                children: [
                    {
                        id: 'employee.requisitions.cash',
                        title: 'Cash',
                        type: 'basic',
                        link: '/axis/requsitions/cash',
                    },
                    {
                        id: 'employee.requisitions.card',
                        title: 'Card',
                        type: 'basic',
                        link: '/axis/requsitions/card',
                    },
                    {
                        id: 'employee.requisitions.device',
                        title: 'Promotional Materials',
                        type: 'basic',
                        link: '/axis/requsitions/device',
                    },
                    {
                        id: 'employee.requisitions.vehicle',
                        title: 'Vehicle',
                        type: 'basic',
                        link: '/axis/requsitions/vehicle',
                    },
                    {
                        id: 'employee.requisitions.asset',
                        title: 'Asset',
                        type: 'basic',
                        link: '/axis/requsitions/asset',
                    },
                ],
            },
        ],
    },
];
export const adminNavigation: FuseNavigationItem[] = [
    {
        id: 'admin',
        title: 'Admin',
        subtitle: 'Admin Pages',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'employee.dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/axis/admin/dashboard',
            },
            // {
            //     id: 'admin.calendar',
            //     title: 'Calendar',
            //     type: 'basic',
            //     icon: 'heroicons_outline:calendar',
            //     link: '/axis/admin/calendar'
            // },
            {
                id: 'admin.announcements',
                title: 'Announcements',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/axis/admin/announcements',
            },
            {
                id: 'admin.departments',
                title: 'Departments',
                type: 'basic',
                icon: 'heroicons_outline:cash',
                link: '/axis/admin/departments',
            },
            {
                id: 'admin.titles',
                title: 'Titles',
                type: 'basic',
                icon: 'heroicons_outline:support',
                link: '/axis/admin/titles',
            },
            {
                id: 'admin.users',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/axis/admin/users',
            },
            {
                id: 'admin.requisitions-items',
                title: 'Requisitions Items',
                type: 'collapsable',
                icon: 'heroicons_outline:support',
                children: [
                    {
                        id: 'admin.requisitions-items.cash',
                        title: 'Cash',
                        type: 'basic',
                        link: '/axis/admin/requisitions-items/cash',
                    },
                    {
                        id: 'admin.requisitions-items.asset',
                        title: 'Asset',
                        type: 'basic',
                        link: '/axis/admin/requisitions-items/asset',
                    },
                    {
                        id: 'admin.requisitions-items.card',
                        title: 'Card',
                        type: 'basic',
                        link: '/axis/admin/requisitions-items/card',
                    },
                    {
                        id: 'admin.requisitions-items.device',
                        title: 'Promotional Materials',
                        type: 'basic',
                        link: '/axis/admin/requisitions-items/device',
                    },
                    {
                        id: 'admin.requisitions-items.vehicle',
                        title: 'Vehicle',
                        type: 'basic',
                        link: '/axis/admin/requisitions-items/vehicle',
                    },
                ],
            },
            {
                id: 'admin.security',
                title: 'Security',
                type: 'collapsable',
                icon: 'heroicons_outline:support',
                children: [
                    {
                        id: 'admin.security.roles',
                        title: 'Role',
                        type: 'basic',
                        link: '/axis/admin/security/roles',
                    },
                    {
                        id: 'admin.security.permissions',
                        title: 'Permissions',
                        type: 'basic',
                        link: '/axis/admin/security/permissions',
                    },
                ],
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        type: 'group',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Misc',
        type: 'group',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
