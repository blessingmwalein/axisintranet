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
        return this._httpClient.post(this._messageBirdUrl, {
            to: toNumber,
            msg: environment.getSendRequisitionMessage(
                toUser,
                fromUser,
                requisitionType
            ),
        });
    }

    sendApprovedWhatsappMessageToUser(
        toNumber: string,
        toUser: string,
        fromUser: string,
        requisitionType: string
    ) {
        return this._httpClient.post(this._messageBirdUrl, {
            to: toNumber,
            msg: environment.getApproveRequisitionMessage(
                toUser,
                fromUser,
                requisitionType
            ),
        });
    }
    sendRejectWhatsappMessageToUser(
        toNumber: string,
        toUser: string,
        fromUser: string,
        requisitionType: string
    ) {
        return this._httpClient.post(this._messageBirdUrl, {
            to: toNumber,
            msg: environment.getRejectRequisitionMessage(
                toUser,
                fromUser,
                requisitionType
            ),
        });
    }
}
