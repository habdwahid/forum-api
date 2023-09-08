const AuthRepository = require('../../../Domains/authentications/AuthRepository')
const LogoutUserUseCase = require('../LogoutUserUseCase')

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const logoutUserUseCase = new LogoutUserUseCase({})

    // Action and assert
    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error when refresh token is not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 12345
    }
    const logoutUserUseCase = new LogoutUserUseCase({})

    // Action and assert
    await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token'
    }
    const mockAuthRepository = new AuthRepository()

    /* mocking needed functions */
    mockAuthRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const logoutUserUseCase = new LogoutUserUseCase({authenticationRepository: mockAuthRepository})

    // Action
    await logoutUserUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})
