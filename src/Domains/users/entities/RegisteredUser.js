class RegisteredUser {
  constructor(payload) {
    this._verifyPayload(payload)

    const {id, fullname, username} = payload

    this.id = id
    this.fullname = fullname
    this.username = username
  }

  _verifyPayload({id, fullname, username}) {
    if (!id || !fullname || !username) throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')

    if (typeof id !== 'string' || typeof fullname !== 'string' || typeof username !== 'string') throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  }
}

module.exports = RegisteredUser
