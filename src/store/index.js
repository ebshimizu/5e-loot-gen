import Vue from "vue";
import Vuex from "vuex";
import { MUTATION, ACTION } from "./ACTIONS";

import Items from "@/data/base-items";
import ItemTables from "@/data/base-item-tables";
import LootTables from "@/data/base-loot-tables";

import { lootGen } from "../generator/loot-gen";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    readOnlyData: {
      items: Items,
      itemTables: ItemTables,
      lootTables: LootTables
    },
    userData: {
      items: {},
      itemTables: {},
      lootTables: {}
    },
    history: []
  },
  getters: {
    items: state => {
      // todo: user-added items
      return state.readOnlyData.items;
    },
    itemTables: state => {
      // todo: user-added items
      return state.readOnlyData.itemTables;
    },
    lootTables: state => {
      // todo: user-added items
      return state.readOnlyData.lootTables;
    },
    lootTableSelect: (state, getters) => {
      return Object.keys(getters.lootTables).map(t => {
        return { text: t, value: t };
      });
    },
    itemsSelect: (state, getters) => {
      return Object.keys(getters.items).map(item => {
        return { text: item, value: item };
      });
    },
    itemTypeSelect: (state, getters) => {
      const types = {};
      const items = getters.items;
      for (const itemId in items) {
        types[items[itemId].type] = true;
      }

      return Object.keys(types).map(type => {
        return { text: type, value: type };
      });
    }
  },
  mutations: {
    [MUTATION.ADD_LOOT_HISTORY](state, result) {
      state.history.unshift(result);
    }
  },
  actions: {
    [ACTION.GENERATE_LOOT]({ commit, getters }, { table, rolls, filters }) {
      const lootResult = lootGen(
        [
          {
            lootTableId: table,
            count: rolls,
            filters
          }
        ],
        getters.lootTables,
        getters.itemTables,
        getters.items
      );

      lootResult.input = { table, rolls };

      commit(MUTATION.ADD_LOOT_HISTORY, lootResult);
    }
  },
  modules: {}
});
