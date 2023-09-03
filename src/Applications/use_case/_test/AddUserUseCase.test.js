const AddUserUseCase = require('../AddUserUseCase')
const PasswordHash = require('../../security/PasswordHash')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser')
const UserRepository = require('../../../Domains/users/UserRepository')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      fullname: 'Dicoding Indonesia',
      username: 'dicoding',
      password: 'secret'
    }
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      fullname: useCasePayload.fullname,
      username: useCasePayload.username
    })

    /* creating dependencies of the use case */
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    /* mocking needed functions */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser))

    /* creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      fullname: useCasePayload.fullname,
      username: useCasePayload.username
    }))
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      fullname: useCasePayload.fullname,
      username: useCasePayload.username,
      password: 'encrypted_password'
    }))
  })
})
