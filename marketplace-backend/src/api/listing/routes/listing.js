module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/listings/latest',
      handler: 'listing.getLatest',
      config: {
        auth: false,
      },
    },
  ],
};