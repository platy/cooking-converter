export class DenseStuff {
    // in grams per litre
    density: number;
    constructor(density: number) {
        this.density = density;
    }
}

interface ExactStuff {
    in<Q extends MeasuredQuantity<Q>>(measure: Measure<Q>): Q;
}

export type Measure<Q extends MeasuredQuantity<Q>> = (quantity: number) => Q;
interface MeasuredQuantity<Q extends MeasuredQuantity<Q>> {
    quantity: number;
    unit: Measure<Q>;
    of(stuff: DenseStuff): ExactStuff;
    in(unit: Measure<Q>): Q;
}

/// VOLUME
export interface VolumeMeasure extends Measure<MeasuredVolume> {
    litres: number;
    (quanity: number): MeasuredVolume;
}

export class MeasuredVolume implements MeasuredQuantity<MeasuredVolume> {
    quantity: number;
    unit: VolumeMeasure;
    constructor(litres: number, unit: VolumeMeasure) {
        this.quantity = litres;
        this.unit = unit;
    }
    litres(): number {
        return this.quantity * this.unit.litres;
    }
    of(stuff: DenseStuff): ExactStuff {
        return new ExactStuffWithMeasuredVolume(this, stuff);
    }
    in(unit: VolumeMeasure): MeasuredVolume {
        return new MeasuredVolume(this.quantity * this.unit.litres / unit.litres, unit);
    }
}

class ExactStuffWithMeasuredVolume implements ExactStuff {
    volume: MeasuredVolume;
    stuff: DenseStuff;
    constructor(volume: MeasuredVolume, stuff: DenseStuff) {
        this.volume = volume;
        this.stuff = stuff;
    }
    in<Q extends MeasuredQuantity<Q>>(measure: Measure<Q>): Q {
        if ((measure as unknown as VolumeMeasure).litres !== undefined) {
            return this.volume.in(measure as unknown as VolumeMeasure) as unknown as Q;
        }
        let unit = measure as unknown as MassMeasure;
        return new MeasuredMass(this.volume.litres() * this.stuff.density / unit.grams, unit) as unknown as Q;
    }
}

/// MASS
export interface MassMeasure extends Measure<MeasuredMass> {
    grams: number;
    (quanity: number): MeasuredMass;
}

export class MeasuredMass implements MeasuredQuantity<MeasuredMass> {
    quantity: number;
    unit: MassMeasure;
    constructor(quantity: number, unit: MassMeasure) {
        this.quantity = quantity;
        this.unit = unit;
    }
    grams(): number {
        return this.quantity * this.unit.grams;
    }
    of(stuff: DenseStuff): ExactStuff {
        return new ExactStuffWithMeasuredMass(this, stuff);
    }
    in(unit: MassMeasure): MeasuredMass {
        return new MeasuredMass(this.grams() / unit.grams, unit);
    }
}

class ExactStuffWithMeasuredMass implements ExactStuff {
    mass: MeasuredMass;
    stuff: DenseStuff;
    constructor(mass: MeasuredMass, stuff: DenseStuff) {
        this.mass = mass;
        this.stuff = stuff;
    }
    in<Q extends MeasuredQuantity<Q>>(measure: Measure<Q>): Q {
        if ((measure as unknown as MassMeasure).grams !== undefined) {
            return this.mass.in(measure as unknown as MassMeasure) as unknown as Q;
        }
        let unit = measure as unknown as VolumeMeasure;
        return new MeasuredVolume(this.mass.grams() / this.stuff.density / unit.litres, unit) as unknown as Q;
    }
}
