import { DenseStuff } from "./measurement";

export const Unspecified = new DenseStuff('Unspecified', 0)
export const Water = new DenseStuff('Water', 1000);
export const Sugar = new DenseStuff('Sugar', 800);
export const Salt = new DenseStuff('Salt', 1200);
export const Butter = new DenseStuff('Butter', 900);
export const CasterSugar = new DenseStuff('CasterSugar', 951.0194);
export const SelfRaisingFlour = new DenseStuff('SelfRaisingFlour', 528.34);
export const LongGrainWhiteRice = new DenseStuff('LongGrainWhiteRice', 781.95);

interface StuffMap {
    [key: string]: DenseStuff
}
export const All: StuffMap = {Unspecified, CasterSugar, SelfRaisingFlour, Water, Sugar, Salt, Butter, LongGrainWhiteRice,}
