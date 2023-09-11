const Jwt = require('@hapi/jwt')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const JwtTokenManager = require('../../security/JwtTokenManager')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')

describe('/authentications', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /authentications', () => {
    it('should response 201 and persisted token', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({username: 'dicoding', password: '$2a$10$YjIbxjU4KkpX7IKo0A8YTOmK2Dpx6rmylRMj9.pndb3bEbxpDde62'}) // password: super_secret
      const requestPayload = {
        username: 'dicoding',
        password: 'super_secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
    })

    it('should response 400 when payload did not contain needed property', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({username: 'dicoding'})
      const requestPayload = {
        username: 'dicoding'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan username dan password')
    })

    it('should response 400 when payload did not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 12345,
        password: 'super_secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username dan password harus string')
    })
  })

  describe('when PUT /authentications', () => {
    it('should return persisted token', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const token = await jwtTokenManager.createRefreshToken({username: 'dicoding'})
      await AuthenticationsTableTestHelper.addToken(token)
      const requestPayload = {
        refreshToken: token
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
    })

    it('should response 400 when refresh token is not defined', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {}
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan token refresh')
    })

    it('should response 400 when refresh token not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: 12345
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token harus string')
    })
  })

  describe('when DELETE /authentications', () => {
    it('should delete authentication token correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const token = await jwtTokenManager.createRefreshToken({username: 'dicoding'})
      await AuthenticationsTableTestHelper.addToken(token)
      const requestPayload = {
        refreshToken: token
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(responseJson.status).toEqual('success')
    })

    it('should response 400 when payload did not contain needed property', async () => {
      // Arrange
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {}
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan token refresh')
    })

    it('should response 400 when payload did not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: 12345
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('refresh token harus string')
    })
  })
})
