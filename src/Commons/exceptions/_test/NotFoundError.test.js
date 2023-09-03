const ClientError = require('../ClientError')
const NotFoundError = require('../NotFoundError')

describe('NotFoundError', () => {
  it('should throw error correctly', () => {
    // Arrange
    const notFoundError = new NotFoundError('not found!')

    // Action and assert
    expect(notFoundError.statusCode).toEqual(404)
    expect(notFoundError.message).toEqual('not found!')
    expect(notFoundError.name).toEqual('NotFoundError')
    expect(notFoundError).toBeInstanceOf(ClientError)
  })
})
