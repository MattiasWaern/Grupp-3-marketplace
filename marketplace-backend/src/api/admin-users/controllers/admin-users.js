'use strict';

module.exports = {
    // hämta alla användare
    async getUsers(ctx) {
        try {
            const users = await strapi.entityService.findMany(
                'plugin::users-permissions.user',
                {
                    fields: ['id', 'username', 'email', 'blocked', 'createdAt'],
                    populate: ['role'],
                }
            );
            ctx.body = users;
        } catch (err) {
            ctx.throw(500, err);        
        }
    },
    
    //funktionen kallas när admin klickar på användare i react
    async toggleBlock(ctx) {
        try {
            const { id } = ctx.params;

            const user = await strapi.entityService.findOne(
                'plugin::users-permissions.user',
                id
            );

            if (!user) {
                return ctx.throw(404, 'Användare hittades inte');
            }

            //här uppdateras användarens status
            const updated = await strapi.entityService.update(
                'plugin::users-permissions.user',
                id,
                { data: { blocked: !user.blocked } }
            );

            // skickar tillbaka det som behövs i react
            ctx.body = {
                id: updated.id,
                username: updated.username,
                blocked: updated.blocked,
            };
        } catch (err) {
            ctx.throw(500, err);
        }
    },
};