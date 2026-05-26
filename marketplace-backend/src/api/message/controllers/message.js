

'use strict';


const { factories } = require('@strapi/strapi');



module.exports = factories.createCoreController('api::message.message', ({ strapi }) => ({

async create(ctx) {
  console.log("=== BODY ===", JSON.stringify(ctx.request.body, null, 2));
  try {
    const result = await super.create(ctx);
    return result;
  } catch (err) {
    console.log("=== CREATE FEL ===", err.message, err.details);
    throw err;
  }
},
  async unreadCount(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Du måste vara inloggad');

    try {
      const unreadCount = await strapi.db.query('api::message.message').count({
        where: {
          read: false,
          receiver: { documentId: user.documentId },
        },
      });
      return { unreadCount };
    } catch (error) {
      strapi.log.error('unreadCount fel:', error.message);
      return ctx.internalServerError('Något gick fel');
    }
  },
}));