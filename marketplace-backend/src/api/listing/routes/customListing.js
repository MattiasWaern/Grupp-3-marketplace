module.exports = {
  routes: [
    {
      method: "GET",
      path: "/listings/herr",
      handler: "custom-listing.getHerrListings",
      config: {
        auth: false,
      },
    },
  ],
};