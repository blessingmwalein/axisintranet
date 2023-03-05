export const environment = {
    production: false,
    snackBarTimeout: 5000,
    filesBaseUrl: 'http://140.82.25.196:8093/files/',
    // filesBaseUrl: 'https://axisbay.co.zw:8097/files/',
    // apiBaseUrl: 'https://axisbay.co.zw:8097/api/',
    apiBaseUrl: "http://140.82.25.196:8093/api/",
    messageBirdUrl: ' https://flows.messagebird.com/flows/',
    get requisitionCreatedUrl() {
        return `${this.messageBirdUrl}d6303a00-3df8-407d-a302-0c9da1a92b3a/invoke`;
    },
    get requisitionApprovedUrl() {
        return `${this.messageBirdUrl}15b53f44-f10f-4cf1-aa83-6a4bbc2f3f8c/invoke`;
    },
    get requisitionRejectedUrl() {
        return `${this.messageBirdUrl}81ac23f9-f40e-4fcc-9e92-50bc3a40f679/invoke`;
    },
    get requisitionReadCollectUrl() {
        return `${this.messageBirdUrl}2f7c9e2c-b3cc-4415-8a82-3b920780965b/invoke`;
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
