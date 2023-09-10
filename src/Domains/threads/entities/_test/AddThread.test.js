const AddThread = require('../AddThread')

describe('AddThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread'
    }

    // Action and assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 1234,
      body: true
    }

    // Action and assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when title more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread Sebuah Thread Sebuah Thread Sebuah Thread',
      body: 'Sebuah body thread'
    }

    // Action and assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR')
  })

  it('should return AddThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Sebuah Thread',
      body: 'Sebuah body thread'
    }

    // Action
    const addThread = new AddThread(payload)

    // Assert
    expect(addThread.title).toEqual(payload.title)
    expect(addThread.body).toEqual(payload.body)
  })
})
