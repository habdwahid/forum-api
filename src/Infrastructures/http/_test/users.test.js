const container = require('../../container')
const createServer = require('../createServer')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('when POST /users', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

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
