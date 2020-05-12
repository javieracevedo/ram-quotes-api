// import { Character } from '../character.model'
import { User } from '../../user/user.model'
import mongoose from 'mongoose'
import { createOne } from '../character.controllers'
import { Character } from '../character.model'
import { signup } from '../../../utils/auth.js'

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

  test('provided user must be a real user', async () => {
    const userId = mongoose.Types.ObjectId()

    const req = { body: { name: 'morty ', createdBy: userId } }
    const res = {
      status(status) {
        expect(status).toBe(404)
        return this
      },
      send(result) {
        expect(result.message).toBe(`User with id ${userId} doesn't exist.`)
      }
    }

    await createOne(req, res)
  })

  test('character must be new', async () => {
    // const signupReq = { 
    //   body: { 
    //     email: 'j@gmail.com', password: 'test' 
    //   }
    // }

    // const user = await signup(, {})
    await Character.createOne({

    })
  })

  // character should not exists already (not sure about this one)

})
