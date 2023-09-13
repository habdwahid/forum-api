const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container
  }

  async postThreadCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name)
    const {id: userId} = request.auth.credentials
    const {threadId} = request.params

    const addedComment = await addCommentUseCase.execute(userId, threadId, request.payload)

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)

    return response
  }
}

module.exports = ThreadCommentsHandler
