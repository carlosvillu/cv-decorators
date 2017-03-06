import sinon from 'sinon'
import {expect} from 'chai'

import cache from '../../src/decorators/cache'
import NodeTracker from '../../src/decorators/cache/tracker/NodeTracker'

describe('Cache', () => {
  it('should ignore the cache in Node by default', () => {
    class Buz {
      constructor () {
        this.rnd = () => Math.random()
      }

      @cache()
      syncRndNumber (num) { return this.rnd() }
    }
    const buz = new Buz()
    expect(buz.syncRndNumber()).to.be.not.eql(buz.syncRndNumber())
  })

  it('should have a cache if the force the cache in node', () => {
    class Buz {
      constructor () {
        this.rnd = () => Math.random()
      }

      @cache({server: true})
      syncRndNumber (num) { return this.rnd() }
    }
    const buz = new Buz()
    expect(buz.syncRndNumber()).to.be.eql(buz.syncRndNumber())
  })

  it('return twice the same random number without params', (done) => {
    class Dummy {
      @cache({server: true})
      asyncRndNumber (num) { return new Promise(resolve => setTimeout(resolve, 100, Math.random())) }
    }
    const dummy = new Dummy()
    Promise.all([dummy.asyncRndNumber(), dummy.asyncRndNumber()])
      .then(([firstCall, secondCall]) => {
        expect(firstCall).to.be.eql(secondCall)
        done()
      })
  })

  describe('Tracking hit and miss in the server', () => {
    let requestToStub
    beforeEach(() => {
      requestToStub = sinon.stub(NodeTracker.prototype, 'requestTo')
    })

    afterEach(() => {
      requestToStub.reset()
    })

    it('use the NodeTracker', () => {
      class Biz {
        constructor () {
          this.rnd = () => Math.random()
        }

        @cache({server: true, trackTo: 'localhost', algorithm: 'lfu'})
        syncRndNumber (num) { return this.rnd() }
      }

      const biz = new Biz()
      biz.syncRndNumber(12)
      const [arg] = requestToStub.getCall(0).args
      expect(arg).to.be.eql({url: 'http://localhost/__tracking/cache/event/node::missing::lfu'})
    })
  })
})
