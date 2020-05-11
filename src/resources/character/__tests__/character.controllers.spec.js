// import { Character } from '../character.model'
import { User } from '../../user/user.model'
// import mongoose from 'mongoose'
import { createOne } from '../character.controllers'

describe('Character controllers', () => {
  test('creates character', async () => {
    expect.assertions(3)

    const user = await User.create({
      email: 'javier@gmail.com',
      password: '1234'
    })

    const req = {
      body: { name: 'summer', createdBy: user._id }
    }
    const res = {
      status(status) {
        expect(status).toBe(201)
        return this
      },
      async json({ data }) {
        expect(req.body.createdBy).toBe(data.createdBy)
        expect(req.body.name).toBe(data.name)
      }
    }

    await createOne(req, res)
  })

  test('name property should be present', async () => {
    expect.assertions(2)

    const user = await User.create({
      email: 'javier@gmail.com',
      password: '1234'
    })

    const req = { body: { createdBy: user._id } }
    const res = {
      status(status) {
        expect(status).toBe(400)
        return this
      },
      send(result) {
        expect(result.message).toBe('name property is required.')
      }
    }

    await createOne(req, res)
  })

  test('createdBy property should be present', async () => {
    expect.assertions(2)

    const req = { body: { name: 'morty' } }
    const res = {
      status(status) {
        expect(status).toBe(400)
        return this
      },
      send(result) {
        expect(result.message).toBe('createdBy property is required.')
      }
    }

    await createOne(req, res)
  })

  test('createdBy id must be a valid objectId', async () => {
    expect.assertions(2)

    const req = { body: { name: 'rick', createdBy: 'aaa' } }
    const res = {
      status(status) {
        expect(status).toBe(400)
        return this
      },
      send(result) {
        expect(result.message).toBe(
          `createdBy id ${req.body.createdBy} is not valid.`
        )
      }
    }

    await createOne(req, res)
  })

  // test('createdBy', () => {
  //   const createdBy = Character.schema.obj.createdBy
  //   expect(createdBy).toEqual({
  //     type: mongoose.SchemaTypes.ObjectId,
  //     ref: 'user',
  //     required: false
  //   })
  // })
})
