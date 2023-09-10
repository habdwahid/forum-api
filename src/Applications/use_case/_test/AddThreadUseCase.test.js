const AddThreadUseCase = require('../AddThreadUseCase')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread correctly', async () => {
    // Arrange
    const userId = 'user-123'
    const useCasePayload = {
      title: 'Sebuah Thread',
      body: 'Sebuah body thread'
    }
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId
    })

    /* creating dependency of the use case */
    const mockThreadRepository = new ThreadRepository()

    /* mocking needed functions */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))

    /* creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload, userId)

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: userId
    }))
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: userId
    }))
  })
})
