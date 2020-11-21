import Vue from "vue";
import Vuex from "vuex";
import slugify from "slugify";
import _ from "lodash";
import { MUTATION, ACTION } from "./ACTIONS";

import Items from "@/data/base-items";
import ItemTables from "@/data/base-item-tables";
import LootTables from "@/data/base-loot-tables";

import { lootGen } from "../generator/loot-gen";

Vue.use(Vuex);

const testMutableData = {
  "User Table Test": _.cloneDeep(ItemTables["Magic Item Table A"])
};

export default new Vuex.Store({
  state: {
    readOnlyData: {
      items: Items,
      itemTables: ItemTables,
      lootTables: LootTables
    },
    userData: {
      items: {},
      itemTables: testMutableData, // temporary test
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
      return _.merge(
        {},
        state.readOnlyData.itemTables,
        state.userData.itemTables
      );
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
    },
    itemTablesBySlug: (state, getters) => {
      const tables = getters.itemTables;
      const ret = {};
      for (const tableId in tables) {
        ret[slugify(tableId)] = { table: tables[tableId], id: tableId };
      }

      return ret;
    }
  },
  mutations: {
    [MUTATION.ADD_LOOT_HISTORY](state, result) {
      state.history.unshift(result);
    },
    [MUTATION.UPDATE_ITEM_TABLE_ROW](state, { tableId, index, data }) {
      // user data is the only mutable structure here
      // if there's an exception, it means a user facing control wasn't properly disabled.
      Vue.set(state.userData.itemTables[tableId], index, data);
    },
    [MUTATION.ADD_ITEM_TABLE_ROW](state, tableId) {
      state.userData.itemTables[tableId].push({
        id: "",
        weight: 1
      });
    },
    [MUTATION.DELETE_ITEM_TABLE_ROW](state, { tableId, rowIndex }) {
      // gotta splice it
      const newArray = state.userData.itemTables[tableId];
      newArray.splice(rowIndex, 1);
      Vue.set(state.userData.itemTables, tableId, newArray);
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
