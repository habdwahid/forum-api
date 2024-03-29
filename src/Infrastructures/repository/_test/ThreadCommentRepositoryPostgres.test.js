const AddComment = require('../../../Domains/thread_comments/entities/AddComment')
const AddedComment = require('../../../Domains/thread_comments/entities/AddedComment')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const pool = require('../../database/postgres/pool')
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
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

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when owner is not verified owner', async () => {
      // Arrange
      const userId = 'user-123'
      const commentId = 'comment-123'
      await ThreadCommentsTableTestHelper.addComment({id: commentId, owner: userId})
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action and assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner('user-321', commentId)).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when owner is verified owner', async () => {
      // Arrange
      const userId = 'user-123'
      const commentId = 'comment-123'
      await ThreadCommentsTableTestHelper.addComment({id: commentId, owner: userId})
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action and assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(userId, commentId))
        .resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const addComment = {
        id: 'comment-123',
        content: 'Sebuah comment',
        owner: 'user-123',
        thread: 'thread-123'
      }
      await ThreadCommentsTableTestHelper.addComment(addComment)
      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'})

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action
      const comment = await threadCommentRepositoryPostgres.getCommentsByThreadId('thread-123')

      // Assert
      expect(comment).toStrictEqual([
        {
          id: addComment.id,
          username: 'dicoding',
          date: comment[0].date,
          content: addComment.content,
          deletedAt: null
        }
      ])
    })
  })

  describe('findCommentById function', () => {
    it('should throw NotFoundError when id is not a valid comment id', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({id: 'comment-123', thread: 'thread-123'})
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action and assert
      await expect(threadCommentRepositoryPostgres.findCommentById('thread-321', 'comment-321')).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when id is a valid comment id', async () => {
      // Arrange
      await ThreadCommentsTableTestHelper.addComment({id: 'comment-123', thread: 'thread-123'})
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action and assert
      await expect(threadCommentRepositoryPostgres.findCommentById('thread-123', 'comment-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
      // Arrange
      const commentId = 'comment-123'
      await ThreadCommentsTableTestHelper.addComment({id: commentId})
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})

      // Action
      await threadCommentRepositoryPostgres.deleteComment(commentId)

      // Assert
      const comment = await ThreadCommentsTableTestHelper.findComment(commentId)

      expect(comment).toHaveLength(1)
      expect(comment.deletedAt).not.toEqual(null)
    })
  })
})
