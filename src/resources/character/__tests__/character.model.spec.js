import { Character } from '../character.model'
import mongoose from 'mongoose'

describe('Character model', () => {
  describe('schema', () => {
    test('name', () => {
      const characterName = Character.schema.obj.name
      expect(characterName).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      })
    })

    test('createdBy', () => {
      const createdBy = Character.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })
  })
})
