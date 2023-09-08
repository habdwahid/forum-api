const NewAuth = require('../NewAuth')

describe('NewAuth entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken'
    }

    // Action and assert
    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: true
    }

    // Action and assert
    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should return NewAuth entity correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    }

    // Action
    const newAuth = new NewAuth(payload)

    // Assert
    expect(newAuth.accessToken).toEqual(payload.accessToken)
    expect(newAuth.refreshToken).toEqual(payload.refreshToken)
  })
})
