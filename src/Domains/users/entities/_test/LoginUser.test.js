const LoginUser = require('../LoginUser')

describe('LoginUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding'
    }

    // Action and assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: true,
      password: {}
    }

    // Action and assert
    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should return LoginUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret'
    }

    // Action
    const loginUser = new LoginUser(payload)

    // Assert
    expect(loginUser.username).toEqual(payload.username)
    expect(loginUser.password).toEqual(payload.password)
  })
})
