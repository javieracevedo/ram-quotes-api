import { Quote } from '../quote.model'
// import mongoose from 'mongoose'

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
        type: String,
        required: true,
        trim: true,
        maxLength: 100
      })
    })
  })
})
