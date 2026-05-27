module.exports = {
  routes: [
    {
      method: "GET",
      path: "/reviews/listings/:listingId",
      handler: "review.customReviews",
      config: {
        auth: false,
      },
    },
  ],
};