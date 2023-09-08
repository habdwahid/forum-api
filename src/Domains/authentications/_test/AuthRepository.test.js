const AuthRepository = require('../AuthRepository')

describe('AuthRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authRepository = new AuthRepository()

    // Action and assert
    await expect(authRepository.addToken('')).rejects.toThrowError('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(authRepository.checkAvailabilityToken('')).rejects.toThrowError('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(authRepository.deleteToken('')).rejects.toThrowError('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
