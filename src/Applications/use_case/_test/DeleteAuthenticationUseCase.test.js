const AuthRepository = require('../../../Domains/authentications/AuthRepository')
const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase')

describe('DeleteAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {}
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

    // Action and assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  })

  it('should throw error when refresh token is not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 12345
    }
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

    // Action and assert
    await expect(deleteAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
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

    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({authenticationRepository: mockAuthRepository})

    // Action
    await deleteAuthenticationUseCase.execute(useCasePayload)

    // Assert
    expect(mockAuthRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
  })
})
