'use strict';

module.exports = {
    routes: [
        //hämta alla användare
        {
            method: 'GET',
            path: '/admin-users',
            handler: 'admin-users.getUsers',

            config: {
                policies: [],
                middlewares: [],
            },
        },

        // toggla blockering på en specifik
        {
            method: 'PUT',
            path: '/admin-users/:id/toggle-block',
            handler: 'admin-users.toggleBlock',

            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};