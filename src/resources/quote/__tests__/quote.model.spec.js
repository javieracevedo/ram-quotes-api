import { Quote } from '../quote.model'
import mongoose from 'mongoose'

describe('Quote model', () => {
  describe('schema', () => {
    test('quote', () => {
      const quote = Quote.schema.obj.quote
      expect(quote).toEqual({
        type: String,
        required: true,
        trim: true,
        maxLength: 150
      })
    })

    test('character', () => {
      const character = Quote.schema.obj.character
      expect(character).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'character',
        required: true
      })
    })

    test('createdBy', () => {
      const createdBy = Quote.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
        inmutable: true
      })
    })
  })
})
