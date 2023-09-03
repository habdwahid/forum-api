class RegisterUser {
  constructor(payload) {
    this._verifyPayload(payload)

    const {fullname, username, password} = payload

    this.fullname = fullname
    this.username = username
    this.password = password
  }

  _verifyPayload({fullname, username, password}) {
    if (!fullname || !username || !password) throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')

    if (typeof fullname !== 'string' || typeof username !== 'string' || typeof password !== 'string') throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')

    if (username.length > 50) throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')

    if (!username.match(/^[\w]+$/)) throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
  }
}

module.exports = RegisterUser
