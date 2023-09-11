/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadCommentsTableTestHelper = {
  async addComment({id = 'comment-123', content = 'Sebuah comment', owner = 'user-123', thread = 'thread-123'}) {
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, thread, createdAt, updatedAt]
    }

    await pool.query(query)
  },
  async findComment(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comments')
  }
}

module.exports = ThreadCommentsTableTestHelper
