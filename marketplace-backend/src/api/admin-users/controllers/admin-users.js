'use strict';

module.exports = {
    // hämta alla användare
    async getUsers(ctx) {
        try {
            const users = await strapi.entityService.findMany(
                'plugin::users-permissions.user',
                {
                    fields: ['id', 'username', 'email', 'blcoked', 'createdAt'],
                    populate: ['role'],
                }
            );
            ctx.body = users;
        } catch (err) {
            ctx.throw(500, err);        
        }
    },

}