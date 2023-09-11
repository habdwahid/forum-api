/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    content: {
      type: 'TEXT',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    createdAt: 'TIMESTAMP',
    updatedAt: 'TIMESTAMP',
    deletedAt: 'TIMESTAMP'
  })
}

exports.down = (pgm) => {
  pgm.dropTable('thread_comments')
}
