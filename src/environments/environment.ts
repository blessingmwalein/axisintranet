// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    snackBarTimeout: 5000,
    // apiBaseUrl: 'http://192.168.1.148:8087/api/',
    // apiBaseUrl: 'http://192.168.1.148:8097/api/',
    // filesBaseUrl: 'http://192.168.1.148:8087/files/',
    // filesBaseUrl: 'http://192.168.1.148:8097/files/',
    filesBaseUrl: 'http://140.82.25.196:8097/files/',
    apiBaseUrl: 'http://140.82.25.196:8097/api/',
    messageBirdUrl:
        'https://flows.messagebird.com/flows/76f31dea-3292-4e39-8d85-d00f1b6f5ef2/invoke',

    getSendRequisitionMessage(
        userTo: string,
        userFrom: string,
        requisitionType: string
    ): string {
        return `Good day ${userTo},${userFrom} has sent you a ${requisitionType} requisition. Please login to your account to view the requisition.`;
    },
    getApproveRequisitionMessage(
        userTo: string,
        userFrom: string,
        requisitionType: string
    ): string {
        return `Good day ${userTo},${userFrom} has approved your ${requisitionType} requisition. Please login to your account to view the requisition.`;
    },

    getRejectRequisitionMessage(
        userTo: string,
        userFrom: string,
        requisitionType: string
    ): string {
        return `Good day ${userTo},${userFrom} has rejected your ${requisitionType} requisition. Please login to your account to view the requisition.`;
    },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
