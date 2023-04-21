export const RAD2ANG = (rad: number) => (rad * 180) / Math.PI;

export const ANG2RAD = (ang: number) => (ang * Math.PI) / 180;

export const GET_RANDOM_VAL = (range: number) =>
    Math.ceil(Math.random() * 100000000) % range;
