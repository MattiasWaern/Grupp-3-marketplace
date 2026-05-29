module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/listings/latest',
      handler: 'custom-listing.getLatest',
      config: {
        auth: false,
      },
    },
  ],
};