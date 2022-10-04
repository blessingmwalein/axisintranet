import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private _messageBirdUrl = environment.messageBirdUrl;

    constructor(private _httpClient: HttpClient) {}

    sendSendWhatsappMessageToUser(
        toNumber: string,
        toUser: string,
        fromUser: string,
        requisitionType: string
    ) {
        return this._httpClient.post(environment.requisitionCreatedUrl, {
            userTo: toUser,
            userFrom: fromUser,
            requisitionType: requisitionType,
            phone: toNumber,
        });
    }

    sendApprovedWhatsappMessageToUser(
        toNumber: string,
        toUser: string,
        fromUser: string,
        requisitionType: string
    ) {
        return this._httpClient.post(environment.requisitionApprovedUrl, {
            userTo: toUser,
            userFrom: fromUser,
            requisitionType: requisitionType,
            phone: toNumber,
        });
    }
    sendRejectWhatsappMessageToUser(
        toNumber: string,
        toUser: string,
        fromUser: string,
        requisitionType: string
    ) {
        return this._httpClient.post(environment.requisitionRejectedUrl, {
            userTo: toUser,
            userFrom: fromUser,
            requisitionType: requisitionType,
            phone: toNumber,
        });
    }

    //create function to add 2 numbers

}
