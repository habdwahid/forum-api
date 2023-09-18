const Jwt = require('@hapi/jwt')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const JwtTokenManager = require('../../security/JwtTokenManager')
const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')


describe('/threads url', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding', id: 'user-123'})
      await AuthenticationsTableTestHelper.addToken(accessToken)
      const requestPayload = {
        title: 'Sebuah Thread',
        body: 'Sebuah body thread'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
      const requestPayload = {
        title: 'Sebuah Thread'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when payload did not meet data type specification', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding', id: 'user-123'})
      await AuthenticationsTableTestHelper.addToken(accessToken)
      const requestPayload = {
        title: 'Sebuah Thread',
        body: 12345
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })

    it('should response 400 when title more than 50 character', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({username: 'dicoding', id: 'user-123'})
      await AuthenticationsTableTestHelper.addToken(accessToken)
      const requestPayload = {
        title: 'Sebuah Thread Sebuah Thread Sebuah Thread Sebuah Thread Sebuah Thread',
        body: 'Sebuah body thread'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit')
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and persisted thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({id: 'thread-123', title: 'Sebuah Thread', body: 'Sebuah body thread', owner: 'user-123'})
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
    })

    it('should response 404 when thread id is invalid', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan, id tidak valid')
    })
  })
})
