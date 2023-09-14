const AddComment = require('../../Domains/thread_comments/entities/AddComment')

class AddCommentUseCase {
  constructor({threadCommentRepository, threadRepository}) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute(userId, threadId, useCasePayload) {
    // Validating thread id
    await this._threadRepository.findThreadById(threadId)

    const addComment = new AddComment(useCasePayload)

    return this._threadCommentRepository.addComment(userId, threadId, addComment)
  }
}

module.exports = AddCommentUseCase
