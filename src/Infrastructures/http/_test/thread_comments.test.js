const Jwt = require('@hapi/jwt')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const JwtTokenManager = require('../../security/JwtTokenManager')
const pool = require('../../database/postgres/pool')
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')

describe('/threads/{threadId}/comments', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadCommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding', id: 'user-123'})
      await AuthenticationsTableTestHelper.addToken(accessToken)

      const threadId = 'thread-123'
      await ThreadsTableTestHelper.addThread({id: threadId})
      const requestPayload = {
        content: 'Sebuah thread comment'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
    })

    it('should response 400 when payload did not contain needed property', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding', id: 'user-123'})
      await AuthenticationsTableTestHelper.addToken(accessToken)

      const threadId = 'thread-123'
      await ThreadsTableTestHelper.addThread({id: threadId})
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when payload did not meet data type specification', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding', id: 'user-123'})
      await AuthenticationsTableTestHelper.addToken(accessToken)

      const threadId = 'thread-123'
      await ThreadsTableTestHelper.addThread({id: threadId})
      const requestPayload = {
        content: 12345
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai')
    })
  })
})
