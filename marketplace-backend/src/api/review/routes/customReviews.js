module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/reviews/listings/:listingsId',
      handler: "review.customReviews",
      config: {
        auth: false,
      }
    }
  ]
}