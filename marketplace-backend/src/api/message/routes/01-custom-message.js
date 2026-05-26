module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/messages/unread-count',
      handler: 'message.unreadCount', 
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};