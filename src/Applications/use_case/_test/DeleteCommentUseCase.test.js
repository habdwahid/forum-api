const DeleteCommentUseCase = require('../DeleteCommentUseCase')
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository')

describe('DeleteCommentUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const userId = 'user-123'
    const useCasePayload = {}
    const deleteCommentUseCase = new DeleteCommentUseCase({})

    // Action and assert
    await expect(deleteCommentUseCase.execute(userId, useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const userId = 'user-123'
    const useCasePayload = {
      id: 12345
    }
    const deleteCommentUseCase = new DeleteCommentUseCase({})

    // Action and assert
    await expect(deleteCommentUseCase.execute(userId, useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete comment action', async () => {
    // Arrange
    const userId = 'user-123'
    const useCasePayload = {
      id: 'comment-123'
    }

    /* creating dependency of the use case */
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /* mocking needed function */
    mockThreadCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    /* creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    await getCommentUseCase.execute(userId, useCasePayload)

    // Assert
    expect(mockThreadCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(userId, useCasePayload.id)
    expect(mockThreadCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.id)
  })
})
