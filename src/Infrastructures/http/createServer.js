const Hapi = require('@hapi/hapi')
const authentications = require('../../Interfaces/http/api/authentications')
const ClientError = require('../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')
const users = require('../../Interfaces/http/api/users')

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  await server.register([
    {
      plugin: users,
      options: {container}
    },
    {
      plugin: authentications,
      options: {container}
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const {response} = request

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response)

      // ClientError
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message
        })
        newResponse.code(translatedError.statusCode)

        return newResponse
      }

      if (!translatedError.isServer) return h.continue

      // Server error
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)

      return newResponse
    }

    return h.continue
  })

  return server
}

module.exports = createServer
