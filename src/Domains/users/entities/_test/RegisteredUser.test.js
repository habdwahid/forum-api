const RegisteredUser = require('../RegisteredUser')

describe('RegisteredUser entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      fullname: 'Dicoding Indonesia'
    }

    // Action and assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      fullname: true,
      username: 'dicoding'
    }

    // Action and assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should return RegisteredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      fullname: 'Dicoding Indonesia',
      username: 'dicoding'
    }

    // Action
    const registeredUser = new RegisteredUser(payload)

    // Assert
    expect(registeredUser.id).toEqual(payload.id)
    expect(registeredUser.fullname).toEqual(payload.fullname)
    expect(registeredUser.username).toEqual(payload.username)
  })
})
