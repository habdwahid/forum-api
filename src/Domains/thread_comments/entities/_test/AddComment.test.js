const AddComment = require('../AddComment')

describe('AddComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(() => new AddComment('')).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 12345
    }

    // Action and assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should return AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Sebuah comment'
    }

    // Action
    const addComment = new AddComment(payload)

    // Assert
    expect(addComment.content).toEqual(payload.content)
  })
})
