import mongoose from 'mongoose'

const characterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: false
    }
  },
  { timestamps: true }
)

export const Character = mongoose.model('character', characterSchema)
