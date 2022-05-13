import { Injectable } from '@angular/core';
import { assign, cloneDeep, omit } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { chats as chatsData, users as usersData, messages as messagesData, profile as profileData } from 'app/mock-api/apps/chat/data';

@Injectable({
    providedIn: 'root'
})
export class ChatMockApi
{
    private _chats: any[] = chatsData;
    private _users: any[] = usersData;
    private _messages: any[] = messagesData;
    private _profile: any = profileData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();

        // Modify the chats array to attach certain data to it
        this._chats = this._chats.map(chat => ({
            ...chat,
            // Get the actual contact object from the id and attach it to the chat
            contact: this._users.find(contact => contact.id === chat.contactId),
            // Since we use same set of messages on all chats, we assign them here.
            messages: this._messages.map(message => ({
                ...message,
                chatId   : chat.id,
                contactId: message.contactId === 'me' ? this._profile.id : chat.contactId,
                isMine   : message.contactId === 'me'
            }))
        }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Chats - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/chats')
            .reply(() => {

                // Clone the chats
                const chats = cloneDeep(this._chats);

                // Return the response
                return [200, chats];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Chat - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/chat')
            .reply(({request}) => {

                // Get the chat id
                const id = request.params.get('id');

                // Clone the chats
                const chats = cloneDeep(this._chats);

                // Find the chat we need
                const chat = chats.find(item => item.id === id);

                // Return the response
                return [200, chat];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Chat - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/chat/chat')
            .reply(({request}) => {

                // Get the id and chat
                const id = request.body.id;
                const chat = cloneDeep(request.body.chat);

                // Prepare the updated chat
                let updatedChat = null;

                // Find the chat and update it
                this._chats.forEach((item, index, chats) => {

                    if ( item.id === id )
                    {
                        // Update the chat
                        chats[index] = assign({}, chats[index], chat);

                        // Store the updated chat
                        updatedChat = chats[index];
                    }
                });

                // Return the response
                return [200, updatedChat];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Contacts - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/users')
            .reply(() => {

                // Clone the users
                let users = cloneDeep(this._users);

                // Sort the users by the name field by default
                users.sort((a, b) => a.name.localeCompare(b.name));

                // Omit details and attachments from users
                users = users.map(contact => omit(contact, ['details', 'attachments']));

                // Return the response
                return [200, users];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Contact Details - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/contact')
            .reply(({request}) => {

                // Get the contact id
                const id = request.params.get('id');

                // Clone the users
                const users = cloneDeep(this._users);

                // Find the contact
                const contact = users.find(item => item.id === id);

                // Return the response
                return [200, contact];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Profile - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/profile')
            .reply(() => {

                // Clone the profile
                const profile = cloneDeep(this._profile);

                // Return the response
                return [200, profile];
            });
    }
}
