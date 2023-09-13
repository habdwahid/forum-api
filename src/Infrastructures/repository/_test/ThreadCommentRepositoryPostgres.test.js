const AddComment = require('../../../Domains/thread_comments/entities/AddComment')
const AddedComment = require('../../../Domains/thread_comments/entities/AddedComment')
const pool = require('../../database/postgres/pool')
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const addComment = new AddComment({
        content: 'Sebuah thread comment'
      })
      const fakeIdGenerator = () => '123'
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await threadCommentRepositoryPostgres.addComment(userId, threadId, addComment)

      // Assert
      const comment = await ThreadCommentsTableTestHelper.findComment('comment-123')

      expect(comment).toHaveLength(1)
    })

    it('should return AddedComment object correctly', async () => {
      // Arrange
      const userId = 'user-123'
      const threadId = 'thread-123'
      const addComment = new AddComment({
        content: 'Sebuah thread comment'
      })
      const fakeIdGenerator = () => '123'
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedComment = await threadCommentRepositoryPostgres.addComment(userId, threadId, addComment)

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: userId
      }))
    })
  })
})
