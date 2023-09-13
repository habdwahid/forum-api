const routes = require('./routes')
const ThreadCommentsHandler = require('./handler')

module.exports = {
  name: 'thread_comments',
  register: async (server, {container}) => {
    const threadCommentsHandler = new ThreadCommentsHandler(container)

    server.route(routes(threadCommentsHandler))
  }
}
