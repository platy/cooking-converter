import {VolumeMeasure, MassMeasure, MeasuredMass, MeasuredVolume, Measure} from './measurement'

function MassMeasure(grams: number): MassMeasure {
    let f = function (quanity: number): MeasuredMass {
        return new MeasuredMass(quanity, f as MassMeasure);
    };
    return Object.assign(f, { grams });
}


function VolumeMeasure(litres: number): VolumeMeasure {
    let f = function (quanity: number): MeasuredVolume {
        return new MeasuredVolume(quanity, f as VolumeMeasure);
    };
    return Object.assign(f, { litres });
}

export const Decilitres = VolumeMeasure(0.1);
export const Litres = VolumeMeasure(1);
export const FlOzUS = VolumeMeasure(0.02957353);

export const Grams = MassMeasure(1);
export const Kilograms = MassMeasure(1000);
export const OzInternational = MassMeasure(28.349523125);

interface UnitMap {
    [key: string]: Measure<any>
}
export const All: UnitMap = {Decilitres, Litres, FlOzUS, Grams, Kilograms, OzInternational}
