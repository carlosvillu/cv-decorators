import {expect} from 'chai'

import {streamify} from '../src'

class Dummy {
  constructor (name) {
    this._name = name
  }

  get name () { return this._name }

  throwError () {
    throw new Error('throwError')
  }

  asyncThrowError () {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject('asyncThrowError'), 0)
    })
  }

  notDecorateMethod (number) {
    return `Called with ${number}`
  }

  dummyMethodPromise (number, multiplicity) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number * multiplicity), 0)
    })
  }

  dummyMethod (number, multiplicity) {
    return number * multiplicity
  }
}

describe('Streamify', () => {
  it('Is a function (decorator)', () => {
    expect(streamify).to.be.a('function')
  })

  describe('Should decorate a class', () => {
    let dummyDecorate

    beforeEach(() => {
      const DummyDecorate = streamify('dummyMethod', 'dummyMethodPromise', 'throwError', 'asyncThrowError')(Dummy)
      dummyDecorate = new DummyDecorate('Carlos')
    })

    afterEach(() => {
      dummyDecorate = null
    })

    it('subscribe to calls and results for sync method', (done) => {
      dummyDecorate.$.dummyMethod.subscribe(({params, result}) => {
        expect(params).to.be.eql([5, 2])
        expect(result).to.be.eql(10)
        done()
      })

      dummyDecorate.dummyMethod(5, 2)
    })

    it('Remaing not decorate methods', () => {
      expect(dummyDecorate.notDecorateMethod(42)).to.be.eql('Called with 42')
    })

    it('Notify sync errors', (done) => {
      dummyDecorate.$.throwError.subscribe(
        console.log.bind(console),
        ({params, error}) => {
          expect(params).to.be.eql([])
          expect(error.message).to.be.eql('throwError')
          done()
        },
        console.log.bind(console)
      )

      try {
        dummyDecorate.throwError()
      } catch (e) {}
    })

    it('Notify Async errors', (done) => {
      dummyDecorate.$.asyncThrowError.subscribe(
        console.log.bind(console),
        ({params, error}) => {
          expect(params).to.be.eql([])
          expect(error).to.be.eql('asyncThrowError')
          done()
        },
        console.log.bind(console)
      )

      dummyDecorate.asyncThrowError()
    })

    it('subscribe to calls and results for Async method', (done) => {
      dummyDecorate.$.dummyMethodPromise.subscribe(({params, result}) => {
        expect(params).to.be.eql([10, 2])
        expect(result).to.be.eql(20)
        done()
      })

      dummyDecorate.dummyMethodPromise(10, 2)
    })
  })
})
