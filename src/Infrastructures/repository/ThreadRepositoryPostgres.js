const AddedThread = require('../../Domains/threads/entities/AddedThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()

    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread(userId, {title, body}) {
    const id = `thread-${this._idGenerator()}`
    const owner = userId
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    return new AddedThread({...result.rows[0]})
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t."createdAt" as date, u.username FROM threads t JOIN users u ON u.id = t.owner WHERE t.id = $1',
      values: [threadId]
    }

    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async findThreadById(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) throw new NotFoundError('thread tidak ditemukan, id tidak valid')
  }
}

module.exports = ThreadRepositoryPostgres
