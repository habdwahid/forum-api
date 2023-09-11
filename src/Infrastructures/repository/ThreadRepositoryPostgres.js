const AddedThread = require('../../Domains/threads/entities/AddedThread')
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
}

module.exports = ThreadRepositoryPostgres