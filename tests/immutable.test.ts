import Immutable from '../src'

describe('Immutable', () => {
    it('simple', () => {
        const obj = new Immutable<{ key: string }>({
            key: 'some value',
        })


    })

    // it('supports deeply nested objects', () => {
    //     const obj = new Immutable<{
    //         keyA: { keyB: Array<string | number> }
    //         keyC: string
    //     }>({
    //         keyA: { keyB: [1, 2, '3'] },
    //         keyC: 'this is text',
    //     })

    //     expect(obj.get('keyC')).toEqual('this is text')
    //     expect(obj.getIn(['keyA', 'keyB', '1'])).toEqual(2)
    // })
})
