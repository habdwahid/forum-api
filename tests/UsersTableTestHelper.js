/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const UsersTableTestHelper = {
  async addUser({id = 'user-123', fullname = 'Dicoding Indonesia', username = 'dicoding', password = 'secret'}) {
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, fullname, username, password, createdAt, updatedAt]
    }

    await pool.query(query)
  },
  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)

    return result.rows
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE users')
  }
}

module.exports = UsersTableTestHelper
