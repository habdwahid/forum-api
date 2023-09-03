const UserRepsitory = require('../UserRepository')

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract class', async () => {
    // Arrange
    const userRepository = new UserRepsitory()

    // Action and assert
    await expect(userRepository.addUser({})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userRepository.verifyAvailableUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
