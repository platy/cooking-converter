import { Grams, OzInternational, Kilograms, Decilitres, Litres, FlOzUS } from '../src/units';
import { CasterSugar, SelfRaisingFlour } from '../src/DenseStuff';

describe('convert volume quanitites', () => {
    test('decilitres and litres', () => {
        expect(Decilitres(5).in(Litres).quantity).toBeCloseTo(0.5)
        expect(Decilitres(5).in(Litres).unit).toBe(Litres)

        expect(Litres(0.5).in(Decilitres).quantity).toBeCloseTo(5)
        expect(Litres(0.5).in(Decilitres).unit).toBe(Decilitres)
    })

    test('litres and fl ounzes', () => {
        expect(FlOzUS(10).in(Litres).quantity).toBeCloseTo(0.2957353, 6)
        expect(FlOzUS(10).in(Litres).unit).toBe(Litres)

        expect(Litres(0.2957353).in(FlOzUS).quantity).toBeCloseTo(10)
        expect(Litres(0.2957353).in(FlOzUS).unit).toBe(FlOzUS)
    })
})

describe('convert mass quanitites', () => {
    test('grams and kilograms', () => {
        let _5GramsInKgs = Grams(5).in(Kilograms)
        expect(_5GramsInKgs.quantity).toBeCloseTo(0.005, 3)
        expect(_5GramsInKgs.unit).toBe(Kilograms)

        let _5KgsInGrams = Kilograms(5).in(Grams)
        expect(_5KgsInGrams.quantity).toBeCloseTo(5000)
        expect(_5KgsInGrams.unit).toBe(Grams)
    })

    test('grams and international avoirdupois ounzes', () => {
        let _1OzFromGrams = Grams(28.349523125).in(OzInternational)
        expect(_1OzFromGrams.quantity).toBeCloseTo(1, 6)
        expect(_1OzFromGrams.unit).toBe(OzInternational)

        let _1OzInGrams = OzInternational(1).in(Grams)
        expect(_1OzInGrams.quantity).toBeCloseTo(28.349523125,6)
        expect(_1OzInGrams.unit).toBe(Grams)
    })
})

describe('convert british baking masses to decilitres', () => {
    it('converts caster sugar to dl', () => {
        let _225GCasterSugarinDl = Grams(225).of(CasterSugar).in(Decilitres)
        expect(_225GCasterSugarinDl.quantity).toBeCloseTo(2.3658823, 6)
        expect(_225GCasterSugarinDl.unit).toBe(Decilitres)
    })

    it('converts self-raising flour to dl', () => {
        let _100GFlourInDl = Grams(100).of(SelfRaisingFlour).in(Decilitres)
        expect(_100GFlourInDl.quantity).toBeCloseTo(1.89272059, 6)
        expect(_100GFlourInDl.unit).toBe(Decilitres)
    })
})

describe('convert decilitres to british baking masses', () => {
    it('converts caster sugar dl to grams', () => {
        let _2DLCasterSugarinGrams = Decilitres(2).of(CasterSugar).in(Grams)
        expect(_2DLCasterSugarinGrams.quantity).toBeCloseTo(190.20388, 6)
        expect(_2DLCasterSugarinGrams.unit).toBe(Grams)
    })

    it('converts self-raising flour dl to grams', () => {
        let _2DLFlourInGrams = Decilitres(2).of(SelfRaisingFlour).in(Grams)
        expect(_2DLFlourInGrams.quantity).toBeCloseTo(105.668, 6)
        expect(_2DLFlourInGrams.unit).toBe(Grams)
    })
})
