
import { normalizeRGB } from '../src/modules/utils';

import { expect } from 'chai';


describe('normalizeColor tests', () => {
    it('checking normalizeColor output', () => { 

        let color = normalizeRGB({red:255, green:255, blue:255});
        expect(color[0]).to.equal(1)
        expect(color[1]).to.equal(1)
        expect(color[2]).to.equal(1)
        expect(color[3]).to.equal(1)

        const errorMessage = 'band out of range each value must be from 1 - 255'
        
        const green = 256
        expect(()=>{normalizeRGB({red:1, green, blue:1})}).to.throw(`value ${green} for green ${errorMessage}`);

        const red = 0
        expect(()=>{normalizeRGB({red, green:1, blue:1})}).to.throw(`value ${red} for red ${errorMessage}`);

    });

});