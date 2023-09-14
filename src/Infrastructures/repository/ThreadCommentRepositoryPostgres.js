const AddedComment = require('../../Domains/thread_comments/entities/AddedComment')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository')

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super()

    this._pool = pool
    this._idGenerator = idGenerator
  }

  /**
   * Store a new comment into storage.
   *
   * @param {string} userId the user id.
   * @param {string} threadId the thread id.
   * @param {AddComment} AddComment the AddComment object.
   * @return {AddedComment} A AddedComment object.
   */
  async addComment(userId, threadId, {content}) {
    const id = `comment-${this._idGenerator()}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6) returning id, content, owner',
      values: [id, content, userId, threadId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    return new AddedComment({...result.rows[0]})
  }

  /**
   * Verify the owner of the comment.
   *
   * @param {string} userId the user id.
   * @param {string} commentId the comment id.
   */
  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE owner = $1 AND id = $2',
      values: [userId, commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new AuthorizationError('tidak dapat melanjutkan permintaan Anda karena Anda bukan pemilik komentar')
  }

  /**
   * Find comment by id.
   *
   * @param {string} threadId the thread id.
   * @param {string} commentId the comment id.
   */
  async findCommentById(threadId, commentId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE thread = $1 AND id = $2',
      values: [threadId, commentId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('komentar tidak ditemukan, id tidak valid')
  }

  /**
   * Remove the comment by id.
   *
   * @param {string} commentId the comment id.
   */
  async deleteComment(commentId) {
    const updatedAt = new Date().toISOString()
    const deletedAt = updatedAt
    const query = {
      text: 'UPDATE thread_comments SET "updatedAt" = $2, "deletedAt" = $3 WHERE id = $1',
      values: [commentId, updatedAt, deletedAt]
    }

    await this._pool.query(query)
  }
}

module.exports = ThreadCommentRepositoryPostgres
