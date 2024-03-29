const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forum-api_jwt'
    }
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request) => handler.getThreadHandler(request)
  }
])

module.exports = routes
