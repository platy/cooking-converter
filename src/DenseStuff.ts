import { DenseStuff } from "./measurement";

export const Unspecified = new DenseStuff(0)
export const CasterSugar = new DenseStuff(951.0194);
export const SelfRaisingFlour = new DenseStuff(528.34);

interface StuffMap {
    [key: string]: DenseStuff
}
export const All: StuffMap = {Unspecified, CasterSugar, SelfRaisingFlour}
