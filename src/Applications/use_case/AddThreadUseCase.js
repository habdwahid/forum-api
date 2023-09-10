const AddThread = require('../../Domains/threads/entities/AddThread')

class AddThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload, userId) {
    const {title, body} = useCasePayload
    const payload = {
      title,
      body,
      owner: userId
    }
    const addThread = new AddThread(payload)

    return this._threadRepository.addThread(addThread)
  }
}

module.exports = AddThreadUseCase
