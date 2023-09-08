const AuthRepository = require('../../../Domains/authentications/AuthRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase')

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error when payload did not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // Action and assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error if refresh token did not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 12345
    }
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // Action and assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token'
    }
    const mockAuthRepository = new AuthRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()

    /* mocking needed functions */
    mockAuthRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({username: 'dicoding', id: 'user-123'}))
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('new_access_token'))

    /* Create the use case instance */
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthRepository,
      authenticationTokenManager: mockAuthenticationTokenManager
    })

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepository.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({username: 'dicoding', id: 'user-123'})
    expect(accessToken).toEqual('new_access_token')
  })
})
