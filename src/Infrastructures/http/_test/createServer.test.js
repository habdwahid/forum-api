const Jwt = require('@hapi/jwt')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const JwtTokenManager = require('../../security/JwtTokenManager')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  it('should response 404 when request unregistered route', async () => {
    // Arrange
    const server = await createServer({})

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute'
    })

    // Assert
    expect(response.statusCode).toEqual(404)
  })

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
    })

    it('should response 400 when request payload did not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when payload did not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        fullname: true,
        username: {},
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai')
    })

    it('should response 400 when username contain more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        username: 'dicodingdicodingdicodingdicodingdicodingdicodingdicoding',
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit')
    })

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        username: 'dicoding indonesia',
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang')
    })

    it('should response 400 when username is unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({username: 'dicoding'})
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
        password: 'secret'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('username tidak tersedia')
    })
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

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      fullname: 'Dicoding Indonesia',
      username: 'dicoding',
      password: 'secret'
    }
    const server = await createServer({})

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload
    })

    // Assert
    const responseJson = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami')
  })
})
