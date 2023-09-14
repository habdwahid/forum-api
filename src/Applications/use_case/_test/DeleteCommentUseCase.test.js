const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository')

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action', async () => {
    // Arrange
    const userId = 'user-123'
    const commentId = 'comment-123'

    /* creating dependency of the use case */
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /* mocking needed function */
    mockThreadCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    /* creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    await getCommentUseCase.execute(userId, commentId)

    // Assert
    expect(mockThreadCommentRepository.findCommentById).toHaveBeenCalledWith(commentId)
    expect(mockThreadCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(userId, commentId)
    expect(mockThreadCommentRepository.deleteComment).toHaveBeenCalledWith(commentId)
  })
})
