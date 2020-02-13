import { Sugar, Unspecified, SelfRaisingFlour, LongGrainWhiteRice, CasterSugar } from '../src/DenseStuff'
import { DenseStuff, MassMeasure, VolumeMeasure} from '../src/measurement'
import { MetricVolumes, CustomaryVolumes, MetricMasses, CustomaryMasses } from '../src/units'

class Suggestor {
  previousUsages: [[MassMeasure | VolumeMeasure, DenseStuff, MassMeasure | VolumeMeasure], number][]
  inputUnit?: VolumeMeasure | MassMeasure
  stuff?: DenseStuff
  outputUnit?: VolumeMeasure | MassMeasure

  inputUnitSuggestions(): (VolumeMeasure | MassMeasure)[] {
    let s = new Map<VolumeMeasure | MassMeasure, number>()
    for (var usage of this.previousUsages) {
      let [[inputUnit, stuff, outputUnit], count] = usage
      if ((!this.stuff || stuff === this.stuff) && (!this.outputUnit || outputUnit === this.outputUnit)) {
        let newCount = (s.get(inputUnit) || 0) + count
        s.set(inputUnit, newCount)
      }
    }
    return Array.from(s.entries()).sort((a, b) => b[1] - a[1]).map(suggestion => suggestion[0])
  }

  denseStuffSuggestions(): DenseStuff[] {
    let s = new Map<DenseStuff, number>()
    for (var usage of this.previousUsages) {
      let [[inputUnit, stuff, outputUnit], count] = usage
      if ((!this.inputUnit || inputUnit === this.inputUnit) && (!this.outputUnit || outputUnit === this.outputUnit)) {
        let newCount = (s.get(stuff) || 0) + count
        s.set(stuff, newCount)
      }
    }
    return Array.from(s.entries()).sort((a, b) => b[1] - a[1]).map(suggestion => suggestion[0])
  }

  outputUnitSuggestions(): (VolumeMeasure | MassMeasure)[] {
    let s = new Map<VolumeMeasure | MassMeasure, number>()
    for (var usage of this.previousUsages) {
      let [[inputUnit, stuff, outputUnit], count] = usage
      if ((!this.inputUnit || inputUnit === this.inputUnit) && (!this.stuff || stuff === this.stuff)) {
        let newCount = (s.get(outputUnit) || 0) + count
        s.set(outputUnit, newCount)
      }
    }
    return Array.from(s.entries()).sort((a, b) => b[1] - a[1]).map(suggestion => suggestion[0])
  }
}

expect.extend({
  startsWith(actual: (VolumeMeasure | MassMeasure)[], expected: (VolumeMeasure | MassMeasure)[]) {
    if (!Array.isArray(actual))
      return {
        pass: false,
        message: () => 'Actual is not an array',
      }
    if (expected.length > actual.length)
      return {
        pass: false,
        message: () => (`expected ${this.utils.printReceived(actual)} to start with ${this.utils.printExpected(expected)}`),
      }
    const pass = this.equals(actual.slice(0, expected.length), expected)
    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(actual)} not to start with ${this.utils.printExpected(expected)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${this.utils.printReceived(actual)} to start with ${this.utils.printExpected(expected)}`),
        pass: false
      }
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      startsWith: (expected: any[]) => CustomMatcherResult;
    }
  }
}

const previousUsages: [[MassMeasure | VolumeMeasure, DenseStuff, MassMeasure | VolumeMeasure], number][] = [
  // 2 selection cases
  [[MetricMasses.Grams, Sugar, MetricVolumes.Decilitres], 2],
  [[MetricMasses.Kilograms, Sugar, MetricVolumes.Decilitres], 1],
  [[MetricMasses.Grams, SelfRaisingFlour, MetricVolumes.Decilitres], 1],
  [[MetricMasses.Grams, Sugar, MetricVolumes.Centilitres], 1],

  // + 1 selection cases
  [[MetricMasses.Grams, LongGrainWhiteRice, CustomaryVolumes.CupUs], 4],
  [[CustomaryMasses.OzInternational, Sugar, MetricVolumes.Litres], 4],
  [[CustomaryMasses.OzUs, CasterSugar, MetricVolumes.Decilitres], 4],

  // + 0 selection cases
  [[CustomaryMasses.OzInternational, LongGrainWhiteRice, CustomaryVolumes.CupUs], 1],
]

const mostUsedInputUnits = [MetricMasses.Grams, CustomaryMasses.OzInternational, CustomaryMasses.OzUs, MetricMasses.Kilograms] // 8, 5, 4, 1
const mostUsedStuffs = [Sugar, LongGrainWhiteRice, CasterSugar, SelfRaisingFlour] // 8, 5, 4, 1
const mostUsedOutputUnits = [MetricVolumes.Decilitres, CustomaryVolumes.CupUs, MetricVolumes.Litres, MetricVolumes.Centilitres] // 8, 5, 4, 1

// 1 selection cases
const mostUsedStuffsWithGramsInput = [LongGrainWhiteRice, Sugar, SelfRaisingFlour] // 4, 3, 1
const mostUsedOutputUnitsWithGramsInput = [CustomaryVolumes.CupUs, MetricVolumes.Decilitres, MetricVolumes.Centilitres] // 4, 3, 1
const mostUsedInputUnitsWithSugar = [CustomaryMasses.OzInternational, MetricMasses.Grams, MetricMasses.Kilograms] // 4, 3, 1
const mostUsedOutputUnitsWithSugar = [MetricVolumes.Litres, MetricVolumes.Decilitres, MetricVolumes.Centilitres] // 4, 3, 1
const mostUsedInputUnitsWithDecilitreOutput = [CustomaryMasses.OzUs, MetricMasses.Grams, MetricMasses.Kilograms] // 4, 3, 1
const mostUsedStuffsWithDecilitreOutput = [CasterSugar, Sugar, SelfRaisingFlour] // 4, 3, 1

// 2 selection cases
const mostUsedInputUnitsWithSugarAndDecilitreOutput = [MetricMasses.Grams, MetricMasses.Kilograms] // 2, 1
const mostUsedStuffsWithGramsInputAndDecilitreOutput = [Sugar, SelfRaisingFlour] // 2, 1
const mostUsedOutputUnitsWithGramsInputAndSugar = [MetricVolumes.Decilitres, MetricVolumes.Centilitres] // 2, 1


describe('suggestion heuristic', () => {
  describe('given nothing is selected', () => { // these would also be the one-touch suggestions which wouldn't change during the session
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    test('input units are ordered by most used', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnits)
    })
    test('stuffs are ordered by most used', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffs)
    })
    test('output units are those most used', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnits)
    })
  })

  describe('given the input unit is selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.inputUnit = MetricMasses.Grams
    test('input units are ordered by most used', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnits)
    })
    test('stuffs are ordered by most used with that input unit', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffsWithGramsInput)
    })
    test('output units are ordered by most used with that input unit with those of the same type first', () => { // TODO
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnitsWithGramsInput)
    })
  })

  describe('given the stuff is selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.stuff = Sugar
    test('input units are ordered by most used with that stuff', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnitsWithSugar)
    })
    test('stuffs are ordered by most used', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffs)
    })
    test('output units are ordered by most used with that stuff', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnitsWithSugar)
    })
  })

  describe('given the output unit is selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.outputUnit = MetricVolumes.Decilitres
    test('input units are ordered by most used with that output unit and with those of the same type first', () => { // TODO
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnitsWithDecilitreOutput)
    })
    test('stuffs are ordered by most used with that output unit', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffsWithDecilitreOutput)
    })
    test('output units are those most used', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnits)
    })
  })

  describe('given the input unit and the stuff are selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.inputUnit = MetricMasses.Grams
    suggestor.stuff = Sugar
    test('input units are ordered by most used with that stuff', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnitsWithSugar)
    })
    test('stuffs are ordered by most used with that input unit', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffsWithGramsInput)
    })
    test('output units are ordered by most used with that input unit and stuff', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnitsWithGramsInputAndSugar)
    })
  })

  describe('given the output unit and the stuff are selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.stuff = Sugar
    suggestor.outputUnit = MetricVolumes.Decilitres
    test('input units are ordered by most used with that output unit and stuff', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnitsWithSugarAndDecilitreOutput)
    })
    test('stuffs are ordered by most used with that output unit', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffsWithDecilitreOutput)
    })
    test('output units are ordered by most used with that stuff', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnitsWithSugar)
    })
  })

  describe('given the input unit and the output unit are selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.inputUnit = MetricMasses.Grams
    suggestor.outputUnit = MetricVolumes.Decilitres
    test('input units are ordered by most used with that output unit and with those of the same type first', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnitsWithDecilitreOutput)
    })
    test('stuffs are ordered by most used with that input unit and output unit', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffsWithGramsInputAndDecilitreOutput)
    })
    test('output units are ordered by most used with that input unit with those of the same type first', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnitsWithGramsInput)
    })
  })

  describe('given all inputs are selected', () => {
    let suggestor = new Suggestor()
    suggestor.previousUsages = previousUsages
    suggestor.inputUnit = MetricMasses.Grams
    suggestor.stuff = Sugar
    suggestor.outputUnit = MetricVolumes.Decilitres
    test('input units are ordered by most used with that output unit and stuff', () => {
      expect(suggestor.inputUnitSuggestions()).startsWith(mostUsedInputUnitsWithSugarAndDecilitreOutput)
    })
    test('stuffs are ordered by most used with that input unit and output unit', () => {
      expect(suggestor.denseStuffSuggestions()).startsWith(mostUsedStuffsWithGramsInputAndDecilitreOutput)
    })
    test('output units are ordered by most used with that input unit and stuff', () => {
      expect(suggestor.outputUnitSuggestions()).startsWith(mostUsedOutputUnitsWithGramsInputAndSugar)
    })
  })
})

describe('adding usages', () => {
  test.todo('without input unit doesnt add')
  test.todo('without stuff doesnt add')
  test.todo('without output unit doesnt add')
  test.todo('with stuff unspecified and input and output different types doesnt add')

  test.todo('stuff is ignored if input and output are of the same type')
  test.todo('with stuff unspecified and input and output the same type it adds')
  test.todo('with stuff specified and input and output different types it adds')
})
