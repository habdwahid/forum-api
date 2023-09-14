const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase')
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase')

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

  async deleteThreadCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name)
    const {id: userId} = request.auth.credentials
    const {threadId, commentId} = request.params

    await deleteCommentUseCase.execute(userId, threadId, commentId)

    return {
      status: 'success'
    }
  }
}

module.exports = ThreadCommentsHandler
