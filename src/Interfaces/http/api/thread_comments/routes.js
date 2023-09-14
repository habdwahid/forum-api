const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postThreadCommentHandler(request, h),
    options: {
      auth: 'forum-api_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request) => handler.deleteThreadCommentHandler(request),
    options: {
      auth: 'forum-api_jwt'
    }
  }
])

module.exports = routes
