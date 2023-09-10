const AddThreadUseCase = require('../AddThreadUseCase')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Sebuah Thread',
      body: 'Sebuah body thread',
      owner: 'user-123'
    }
    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
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
    const addedThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    }))
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner
    }))
  })
})
