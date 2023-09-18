const GetThreadUseCase = require('../GetThreadUseCase')
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123'
    const date = new Date().toISOString()
    const mockThread = {
      id: threadId,
      title: 'Sebuah thread',
      body: 'Sebuah body thread',
      date: date,
      username: 'dicoding'
    }
    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: date,
        content: 'Sebuah comment'
      }
    ]
    const mockThreadWithComments = {...mockThread, comments: mockComments}

    /* creating dependency of the use case */
    const mockThreadCommentRepository = new ThreadCommentRepository()
    const mockThreadRepository = new ThreadRepository()

    /* mocking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread))
    mockThreadCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments))

    /* create the use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository
    })

    // Action
    const thread = await getThreadUseCase.execute(threadId)

    // Assert
    expect(mockThreadRepository.findThreadById).toBeCalledWith(threadId)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId)
    expect(mockThreadCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId)
    expect(thread).toEqual(mockThreadWithComments)
  })
})
