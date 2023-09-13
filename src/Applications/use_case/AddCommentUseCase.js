const AddComment = require('../../Domains/thread_comments/entities/AddComment')

class AddCommentUseCase {
  constructor({threadCommentRepository, threadRepository}) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute(userId, threadId, useCasePayload) {
    const addComment = new AddComment(useCasePayload)

    // Validating thread id
    this._threadRepository.findThreadById(threadId)

    return this._threadCommentRepository.addComment(userId, threadId, addComment)
  }
}

module.exports = AddCommentUseCase
