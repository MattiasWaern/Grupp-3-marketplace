'use strict';

/**
 * review controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
  async customReviews(ctx) {

  console.log("PARAMS:", ctx.params);
    try {
      const { listingId } = ctx.params;

      const reviews = await strapi.entityService.findMany(
        "api::review.review", 
        {
          filters: {
            listing: {
              id: listingId,
            },
          },
          populate: ["listing", "users_permissions_user"],
        }
      );
      ctx.body = reviews;
    } catch (err) {
      ctx.body = err;
    }
  }
}));
