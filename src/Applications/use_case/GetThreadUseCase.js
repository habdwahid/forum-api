class GetThreadUseCase {
  constructor({threadCommentRepository, threadRepository}) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute(threadId) {
    // Validating thread by id
    await this._threadRepository.findThreadById(threadId)

    const comments = await this._threadCommentRepository.getCommentsByThreadId(threadId)

    const thread = await this._threadRepository.getThreadById(threadId)

    return {...thread, comments: comments}
  }
}

module.exports = GetThreadUseCase
