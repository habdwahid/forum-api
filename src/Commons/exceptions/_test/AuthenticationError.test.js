const AuthenticationError = require('../AuthenticationError')
const ClientError = require('../ClientError')

describe('AuthenticationError', () => {
  it('should throw AuthenticationError correctly', () => {
    // Arrange
    const authenticationError = new AuthenticationError('authentication error')

    // Action and assert
    expect(authenticationError.statusCode).toEqual(401)
    expect(authenticationError.message).toEqual('authentication error')
    expect(authenticationError.name).toEqual('AuthenticationError')
    expect(authenticationError).toBeInstanceOf(ClientError)
  })
})
