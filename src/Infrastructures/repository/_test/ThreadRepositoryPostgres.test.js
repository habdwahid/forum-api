const AddThread = require('../../../Domains/threads/entities/AddThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const pool = require('../../database/postgres/pool')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
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
})
