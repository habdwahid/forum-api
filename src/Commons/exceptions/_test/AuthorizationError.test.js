const AuthorizationError = require('../AuthorizationError')
const ClientError = require('../ClientError')

describe('AuthorizationError', () => {
  it('should throw AuthorizationError correctly', () => {
    // Arrange
    const authorizationError = new AuthorizationError('unauthorized')

    // Action and assert
    expect(authorizationError.statusCode).toEqual(403)
    expect(authorizationError.message).toEqual('unauthorized')
    expect(authorizationError.name).toEqual('AuthorizationError')
    expect(authorizationError).toBeInstanceOf(ClientError)
  })
})
