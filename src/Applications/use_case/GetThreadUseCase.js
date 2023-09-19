class GetThreadUseCase {
  constructor({threadCommentRepository, threadRepository}) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute(threadId) {
    await this._threadRepository.findThreadById(threadId)

    const thread = await this._threadRepository.getThreadById(threadId)

    const comments = await this._threadCommentRepository.getCommentsByThreadId(threadId)

    return {...thread, comments: comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.deletedAt === null ? comment.content : '**komentar telah dihapus**'
    }))}
  }
}

module.exports = GetThreadUseCase
