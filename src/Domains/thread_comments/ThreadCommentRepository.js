class ThreadCommentRepository {
  async addComment(userId, addComment) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentOwner(id) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteComment(id) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadCommentRepository
