import { DenseStuff } from "./measurement";

export const Unspecified = new DenseStuff(0)
export const Water = new DenseStuff(1000);
export const Sugar = new DenseStuff(800);
export const Salt = new DenseStuff(1200);
export const Butter = new DenseStuff(900);
export const CasterSugar = new DenseStuff(951.0194);
export const SelfRaisingFlour = new DenseStuff(528.34);
export const LongGrainWhiteRice = new DenseStuff(781.95);

interface StuffMap {
    [key: string]: DenseStuff
}
export const All: StuffMap = {Unspecified, CasterSugar, SelfRaisingFlour, Water, Sugar, Salt, Butter, LongGrainWhiteRice,}
