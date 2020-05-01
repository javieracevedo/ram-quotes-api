import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150 // need to check on this
    },
    character: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100 // need to check on this
    }
  },
  { timestamps: true }
)

// study the index shit, but don't spend to much time on it yet, that's beyond the point
export const Quote = mongoose.model('quote', quoteSchema)
