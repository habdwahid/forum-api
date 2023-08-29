const ClientError = require('../ClientError')
const InvariantError = require('../InvariantError')

describe('InvariantError', () => {
  it('should return InvariantError correctly', () => {
    // Arrange
    const invariantError = new InvariantError('some error')

    // Action and assert
    expect(invariantError).toEqual('some error')
    expect(invariantError).toBeInstanceOf(ClientError)
  })
})
