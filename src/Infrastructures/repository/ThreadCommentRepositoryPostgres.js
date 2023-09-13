const AddedComment = require('../../Domains/thread_comments/entities/AddedComment')
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
}

module.exports = ThreadCommentRepositoryPostgres
