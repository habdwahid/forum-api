class DeleteCommentUseCase {
  constructor({threadCommentRepository}) {
    this._threadCommentRepository = threadCommentRepository
  }

  /**
   * Executing the delete comment action.
   *
   * @param {string} userId the user id.
   * @param {string} commentId the comment id.
   */
  async execute(userId, commentId) {
    // Find comment by id
    await this._threadCommentRepository.findCommentById(commentId)

    // Validating comment owner
    await this._threadCommentRepository.verifyCommentOwner(userId, commentId)

    // Deleting comment
    await this._threadCommentRepository.deleteComment(commentId)
  }
}

module.exports = DeleteCommentUseCase
