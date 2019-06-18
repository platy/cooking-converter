import {h, render, Component} from 'preact'
import { All as AllUnits, TopInputs, TopOutputs, } from './units'
import { All as AllStuffs } from './DenseStuff'
import linkState from 'linkstate'
import './style.css'


type AppState = {
    quantity?: number,
    inputUnit?: string,
    outputUnit?: string,
    selectedStuff?: string,
    inputUnitOptions: string[],
    outputUnitOptions: string[],
}

class ConverterApp extends Component<{}, AppState> {
    constructor({}) {
        super()
        this.state = {
            inputUnitOptions: Object.keys(TopInputs),
            outputUnitOptions: Object.keys(TopOutputs),
        }
    }

    render({}, {quantity, inputUnit, selectedStuff = "Unspecified", inputUnitOptions, outputUnitOptions, }: AppState) {
        let inputUnits = []
        for (let unit of inputUnitOptions) {
            inputUnits.push(
                <li>
                    <input id={"iunit-" + unit} value={unit} checked={unit === inputUnit} name="input-unit" type="radio" onChange={linkState(this, 'inputUnit', 'target.value')}></input>
                    <label for={"iunit-" + unit}>{unit}</label>
                </li>)
        }

        let stuffs = []
        for (let stuff in AllStuffs) {
            stuffs.push(
                <li>
                    <input id={"stuff-" + stuff} value={stuff} checked={stuff === selectedStuff} name="input-stuff" type="radio" onChange={linkState(this, 'selectedStuff', 'target.value')}></input>
                    <label for={"stuff-" + stuff}>{stuff}</label>
                </li>
            )
        }

        let outputUnits = []

        let result
        if (quantity && inputUnit) {
            let imeasure = AllUnits[inputUnit]
            let input = imeasure(quantity)
            let stuff = AllStuffs[selectedStuff]

            for (let outputUnit of outputUnitOptions) {
                let omeasure = AllUnits[outputUnit]
                result = input.of(stuff).in(omeasure).quantity
                outputUnits.push(
                    <li>
                    {Math.round(result * 1000) / 1000} {outputUnit}
                    </li>)
            }
        }
        return <section>
            <label for="quantity">Quantity</label>
            <input id="quantity" type="number" value={quantity} placeholder="enter quantity" autofocus={true} onInput={linkState(this, 'quantity')} />
            <ul>{inputUnits}</ul>
            <p>
                {quantity} {inputUnit} of:
            </p>  
            <ul>{stuffs}</ul>
            <ul>{outputUnits}</ul>
        </section>
    }
}

render(<ConverterApp />, document.body)
