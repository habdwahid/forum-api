const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread function', () => {
    it('should persist add user', async () => {
      // Arrange
      const userId = 'user-123'
      const addThread = new AddThread({
        title: 'Sebuah Thread',
        body: 'Sebuah body thread'
      })
      const fakeIdGenerator = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadRepositoryPostgres.addThread(userId, addThread)

      // Assert
      const thread = await ThreadsTableTestHelper.findThread('thread-123')

      expect(thread).toHaveLength(1)
    })

    it('should return addedThread object correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const addThread = new AddThread({
        title: 'Sebuah Thread',
        body: 'Sebuah thread body'
      })
      const fakeIdGenerator = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(userId, addThread)

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: userId
      }))
    })
  })

  describe('getThreadById function', () => {
    it('should return thread object correctly', async () => {
      // Arrange
      const addThread = {
        id: 'thread-123',
        title: 'Sebuah Thread',
        body: 'Sebuah body thread',
        owner: 'user-123'
      }
      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'})
      await ThreadsTableTestHelper.addThread(addThread)

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123')

      // Assert
      expect(thread).toStrictEqual({
        id: addThread.id,
        title: addThread.title,
        body: addThread.body,
        date: thread.date,
        username: 'dicoding'
      })
    })
  })

  describe('findThreadById function', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and assert
      await expect(threadRepositoryPostgres.findThreadById('thread-123')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread was found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({id: 'thread-123'})
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

      // Action and assert
      await expect(threadRepositoryPostgres.findThreadById('thread-123')).resolves.not.toThrowError(NotFoundError)
    })
  })
})
