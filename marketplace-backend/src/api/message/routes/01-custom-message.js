module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/messages/unread-count',
      handler: 'api::message.message.unreadCount', 
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};