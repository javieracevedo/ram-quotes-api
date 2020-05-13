// import { Character } from '../character.model'
import { User } from '../../user/user.model'
import mongoose from 'mongoose'
import { createOne } from '../character.controllers'
import { Character } from '../character.model'

describe('Character controllers', () => {
  test('creates character', async () => {
    expect.assertions(2)

    const user = await User.create({
      email: 'javier@gmail.com',
      password: '1234'
    })

    const req = {
      body: { name: 'summer' },
      user
    }
    const res = {
      status(status) {
        expect(status).toBe(201)
        return this
      },
      async json({ data }) {
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

  test('provided user must be a real user', async () => {
    const req = {
      body: { name: 'mortyyyy' },
      user: { _id: mongoose.Types.ObjectId() }
    }
    const res = {
      status(status) {
        expect(status).toBe(404)
        return this
      },
      send(result) {
        expect(result.message).toBe(
          `User with id ${req.user._id} doesn't exist.`
        )
      }
    }

    await createOne(req, res)
  })

  test('character must be new', async () => {
    const userId = mongoose.Types.ObjectId()
    await Character.create({
      name: 'test-char',
      createdBy: userId
    })

    const req = { body: { name: 'test-char', createdBy: userId } }
    const res = {
      status(status) {
        expect(status).toBe(403)
        return this
      },
      send(result) {
        expect(result.message).toBe(
          `Character ${req.body.name} already exists.`
        )
      }
    }

    await createOne(req, res)
  })
})
