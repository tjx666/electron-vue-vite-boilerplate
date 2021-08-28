import { Mutation } from 'vuex';

export enum MutationType {
    increment = 'increment',
}

export type Mutations<S> = Record<MutationType, Mutation<S>>;
