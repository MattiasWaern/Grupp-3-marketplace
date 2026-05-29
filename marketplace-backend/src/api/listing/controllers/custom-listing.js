/* global strapi */
// @ts-nocheck
"use strict";

module.exports = {
  async getLatest(ctx) {
    try {
      const listings = await strapi.entityService.findMany(
        "api::listing.listing",
        {
          populate: ["image", "user"],
          orderBy: { publishedAt: "desc" },
          limit: 4,
        },
      );

      ctx.body = { data: listings };
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
