/* eslint-disable camelcase */
const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const authentications = require('../../Interfaces/http/api/authentications')
const ClientError = require('../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator')
const thread_comments = require('../../Interfaces/http/api/thread_comments')
const threads = require('../../Interfaces/http/api/threads')
const users = require('../../Interfaces/http/api/users')

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('forum-api_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: {container}
    },
    {
      plugin: authentications,
      options: {container}
    },
    {
      plugin: threads,
      options: {container}
    },
    {
      plugin: thread_comments,
      options: {container}
    }
  ])

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      value: 'Hello world!'
    })
  })

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
