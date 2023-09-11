const AddComment = require('../../../Domains/thread_comments/entities/AddComment')
const AddedComment = require('../../../Domains/thread_comments/entities/AddedComment')
const AddCommentUseCase = require('../AddCommentUseCase')
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action', async () => {
    // Arrange
    const userId = 'user-123'
    const useCasePayload = {
      content: 'Sebuah comment'
    }
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId
    })

    /* creating dependency of the use case */
    const mockThreadCommentRepository = new ThreadCommentRepository()

    /* mocking needed functions */
    mockThreadCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    /* creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository
    })

    // Action
    const addedComment = await getCommentUseCase.execute(userId, useCasePayload)

    // Assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userId
    }))
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(userId, new AddComment({
      content: useCasePayload.content
    }))
  })
})
