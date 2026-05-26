'use strict';

/**
 * message controller
 */

module.exports = {
  /**
   * @param {import('@strapi/strapi').Core.Context} ctx
   */
  async unreadCount(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Du måste vara inloggad för att se olästa meddelanden');
    }

    try {
      const receiverFilter = {};
      
      if (user.documentId) {
        receiverFilter.documentId = user.documentId;
      } else if (user.id) {
        receiverFilter.id = user.id;
      }

      const unreadCount = await strapi.documents('api::message.message').count({
        filters: {
          read: false,
          receiver: receiverFilter,
        },
      });

      return { unreadCount };
    } catch (error) {
      console.error("FEL I UNREAD COUNT ENDPOINT:", error);
      
      return ctx.internalServerError('Något gick fel vid beräkningen', { 
        message: error.message 
      });
    }
  },
};