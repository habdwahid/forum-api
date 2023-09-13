const ThreadCommentRepository = require('../ThreadCommentRepository')

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository()

    // Action and assert
    await expect(threadCommentRepository.addComment('', '', {})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.verifyCommentOwner('', '')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.deleteComment('')).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
