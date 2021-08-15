import Immutable from '../src'

describe('get', () => {
    it('nested complex data', () => {
        const obj = new Immutable({
            abc: 'some value',
            nested: { key: 'hi', someArray: [1, 2, 'value'] },
            really_nested: { level1: { level2: 'value!' } },
        })

        expect(obj.get('abc')).toEqual('some value')
        expect(obj.get('nested').get('key')).toEqual('hi')
        expect(obj.get('nested').get('someArray').get(1)).toEqual(2)
        expect(obj.get('nested').get('someArray').get(2)).toEqual('value')
        expect(obj.get('really_nested').get('level1').get('level2')).toEqual(
            'value!',
        )
    })
})

describe('getIn', () => {
    it('nested complex data', () => {
        const obj = new Immutable({
            abc: 'some value',
            nested: { key: 'hi', someArray: [1, 2, 'value'] },
            really_nested: { level1: { level2: 'value!' } },
        })

        const a = obj.getIn(['abc'])

        expect(obj.getIn(['abc'])).toEqual('some value')
        expect(obj.getIn(['nested', 'key'])).toEqual('hi')
        expect(obj.getIn(['nested', 'someArray', 1])).toEqual(2)
        expect(obj.getIn(['nested', 'someArray', 2])).toEqual('value')
        expect(obj.getIn(['really_nested', 'level1', 'level2'])).toEqual(
            'value!',
        )
    })
})
