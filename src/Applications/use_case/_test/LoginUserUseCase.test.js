const AuthRepository = require('../../../Domains/authentications/AuthRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const LoginUserUseCase = require('../LoginUserUseCase')
const NewAuth = require('../../../Domains/authentications/entities/NewAuth')
const UserRepository = require('../../../Domains/users/UserRepository')
const PasswordHash = require('../../security/PasswordHash')

describe('LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret'
    }
    const mockAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    })
    const mockUserRepository = new UserRepository()
    const mockAuthRepository = new AuthRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()
    const mockPasswordHash = new PasswordHash()

    /* mocking needed functions */
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.accessToken))
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.refreshToken))
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'))
    mockAuthRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve())

    /* create use case instance */
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash
    })

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token'
    }))
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding')
    expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password')
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding')
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({username: 'dicoding', id: 'user-123'})
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({username: 'dicoding', id: 'user-123'})
    expect(mockAuthRepository.addToken).toBeCalledWith(mockAuthentication.refreshToken)
  })
})
