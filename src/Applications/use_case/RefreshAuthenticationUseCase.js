class RefreshAuthenticationUseCase {
  constructor({authenticationRepository, authenticationTokenManager}) {
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
  }

  async execute(useCasePayload) {
    // Validating payload
    this._validatePayload(useCasePayload)

    const {refreshToken} = useCasePayload

    // Verifying refresh token
    await this._authenticationTokenManager.verifyRefreshToken(refreshToken)

    // Check availability token
    await this._authenticationRepository.checkAvailabilityToken(refreshToken)

    // Decode the payload
    const {username, id} = await this._authenticationTokenManager.decodePayload(refreshToken)

    return this._authenticationTokenManager.createAccessToken({username, id})
  }

  _validatePayload({refreshToken}) {
    if (!refreshToken) throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')

    if (typeof refreshToken !== 'string') throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  }
}

module.exports = RefreshAuthenticationUseCase
