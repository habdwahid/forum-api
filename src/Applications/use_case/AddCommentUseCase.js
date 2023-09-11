const AddComment = require('../../Domains/thread_comments/entities/AddComment')

class AddCommentUseCase {
  constructor({threadCommentRepository}) {
    this._threadCommentRepository = threadCommentRepository
  }

  async execute(userId, useCasePayload) {
    const addComment = new AddComment(useCasePayload)

    return this._threadCommentRepository.addComment(userId, addComment)
  }
}

module.exports = AddCommentUseCase
