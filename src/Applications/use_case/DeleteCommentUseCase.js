class DeleteCommentUseCase {
  constructor({threadCommentRepository}) {
    this._threadCommentRepository = threadCommentRepository
  }

  /**
   * Executing the delete comment action.
   *
   * @param {string} userId
   * @param {object} useCasePayload
   */
  async execute(userId, useCasePayload) {
    // Validating payload.
    this._validatePayload(useCasePayload)

    const {id} = useCasePayload

    // Validating comment owner
    await this._threadCommentRepository.verifyCommentOwner(userId, id)

    // Deleting comment
    await this._threadCommentRepository.deleteComment(id)
  }

  /**
   * Validate the payload.
   *
   * @param {string} id
   */
  _validatePayload({id}) {
    if (!id) throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')

    if (typeof id !== 'string') throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  }
}

module.exports = DeleteCommentUseCase
