
import { normalizeColor } from '../src/modules/utils';

import { expect } from 'chai';


describe('normalizeColor tests', () => {
    it('checking normalizeColor output', () => { 

        let color = normalizeColor({red:255, green:255, blue:255});

        expect(color[0]).to.equal(1)
        expect(color[1]).to.equal(1)
        expect(color[2]).to.equal(1)
        expect(color[3]).to.equal(1)

        color = normalizeColor({red:256, green:256, blue:256});

        expect(color[0]).to.equal(1)
        expect(color[1]).to.equal(1)
        expect(color[2]).to.equal(1)
        expect(color[3]).to.equal(1)

        color = normalizeColor({red:0, green:0, blue:0});

        expect(color[0]).to.equal(0)
        expect(color[1]).to.equal(0)
        expect(color[2]).to.equal(0)
        expect(color[3]).to.equal(0)
    });

});