/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    fullname: {
      type: 'TEXT',
      notNull: true
    },
    username: {
      type: 'VARCHAR(50)',
      unique: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    },
    created_at: 'TIMESTAMP',
    updated_at: 'TIMESTAMP'
  })
}

exports.down = (pgm) => {
  pgm.dropTable('users')
}
