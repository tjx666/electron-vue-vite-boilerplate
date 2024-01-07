import type { InjectionKey } from 'vue';
import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';

import type { Mutations } from './mutation-types';

export interface State {
    count: number;
}

const state: State = {
    count: 1,
};

const mutations: Mutations<State> = {
    increment(state) {
        state.count++;
    },
};

export const store = createStore<State>({
    state,
    mutations,
});

export const key: InjectionKey<Store<State>> = Symbol();
export function useStore() {
    return baseUseStore(key);
}
