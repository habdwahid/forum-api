const RegisterUser = require('../RegisterUser')

describe('RegisterUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret'
    }

    // Action and assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      fullname: true,
      username: {},
      password: 'secret'
    }

    // Action and assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when username contain more than 50 character', () => {
    // Arrange
    const payload = {
      fullname: 'Dicoding Indonesia',
      username: 'dicodingdicodingdicodingdicodingdicodingdicodingdicoding',
      password: 'secret'
    }

    // Action and assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR')
  })

  it('should throw error when username contain restricted character', () => {
    // Arrange
    const payload = {
      fullname: 'Dicoding Indonesia',
      username: 'dicoding indonesia',
      password: 'secret'
    }

    // Action and assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
  })

  it('should return RegisterUser object correctly', () => {
    // Arrange
    const payload = {
      fullname: 'Dicoding Indonesia',
      username: 'dicoding',
      password: 'secret'
    }

    // Action
    const registerUser = new RegisterUser(payload)

    // Assert
    expect(registerUser.fullname).toEqual(payload.fullname)
    expect(registerUser.username).toEqual(payload.username)
    expect(registerUser.password).toEqual(payload.password)
  })
})
