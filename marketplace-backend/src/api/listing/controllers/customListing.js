// @ts-nocheck
"use strict";

module.exports = {
  async getHerrListings(ctx) {
    const listings = await strapi.entityService.findMany(
      "api::listing.listing",
      {
        filters: {
          category: "Kläder",
          subcategory: "Herr",
        },
        populate: "*",
      }
    );

    ctx.body = listings;
  },
};