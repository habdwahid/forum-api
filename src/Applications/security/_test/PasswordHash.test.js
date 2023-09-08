const PasswordHash = require('../PasswordHash')

describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHash = new PasswordHash()

    // Action and assert
    await expect(passwordHash.hash('')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
    await expect(passwordHash.comparePassword('plain', 'encrypted')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  })
})
