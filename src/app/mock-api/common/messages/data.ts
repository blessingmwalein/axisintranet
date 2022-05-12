/* eslint-disable */
import * as moment from 'moment';

export const messages = [
    {
        id         : '832276cc-c5e9-4fcc-8e23-d38e2e267bc9',
        image      : 'assets/images/avatars/blessing-mwale.webp',
        title      : 'Blessing Mwale(Senior Front end Developer)',
        description: 'Iso training to be attended on Friday',
        time       : moment().subtract(25, 'minutes').toISOString(), // 25 minutes ago
        read       : false
    },
    {
        id         : '608b4479-a3ac-4e26-8675-3609c52aca58',
        image      : 'assets/images/avatars/blessing-mwale.webp',
        title      : 'Phil Kent (Leader of Developers)',
        description: 'Scrum meeting to be attended',
        time       : moment().subtract(50, 'minutes').toISOString(), // 50 minutes ago
        read       : false
    },
];
