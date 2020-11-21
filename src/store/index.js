import Vue from "vue";
import Vuex from "vuex";
import slugify from "slugify";
import _ from "lodash";
import { MUTATION, ACTION } from "./ACTIONS";
import { Persistence } from "./persistence";

import Items from "@/data/base-items";
import ItemTables from "@/data/base-item-tables";
import LootTables from "@/data/base-loot-tables";

import { lootGen } from "../generator/loot-gen";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [Persistence],
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
    },
    [MUTATION.RENAME_ITEM_TABLE](state, { oldName, newName }) {
      // couple things to check here
      // the ui will only let you do this if there are no name conflicts
      // if you manage to do that anyway, uhhh file a bug report
      // first, transfer the object
      Vue.set(
        state.userData.itemTables,
        newName,
        state.userData.itemTables[oldName]
      );
      Vue.delete(state.userData.itemTables, oldName);

      // next, rename references to tables that used this one
      // again, only user data is mutable
      for (const lootTableId in state.userData.lootTables) {
        const lootTable = state.userData.lootTables[lootTableId];
        // we're looking in the items section
        for (const rowIndex in lootTable.table) {
          const row = lootTable.table[rowIndex];

          for (const itemIndex in row.items) {
            const itemEntry = row.items[itemIndex];
            if (itemEntry.itemTableId === oldName) {
              // yike
              Vue.set(
                state.userData.lootTables[lootTable].table[rowIndex].items[
                  itemIndex
                ],
                "itemTableId",
                newName
              );
            }
          }
        }
      }
    },
    [MUTATION.DELETE_ITEM_TABLE](state, tableId) {
      // delete, then remove references
      // UI should warn about things that use the table
      Vue.delete(state.userData.itemTables, tableId);

      for (const lootTableId in state.userData.lootTables) {
        const lootTable = state.userData.lootTables[lootTableId];
        // we're looking in the items section
        for (const rowIndex in lootTable.table) {
          const row = lootTable.table[rowIndex];

          // ok now we want to filter the row items
          const newItems = row.items.filter(r => r.itemTableId !== tableId);

          // set
          Vue.set(
            state.userData.lootTables[lootTableId].table[rowIndex],
            "items",
            newItems
          );
        }
      }
    },
    [MUTATION.ADD_ITEM_TABLE](state, tableId) {
      // relying on ui for validation here
      Vue.set(state.userData.itemTables, tableId, []);
    },
    [MUTATION.COPY_ITEM_TABLE](state, { srcTableId, destTableId }) {
      const toCopy =
        srcTableId in state.userData.itemTables
          ? state.userData.itemTables[srcTableId]
          : state.readOnlyData.itemTables[srcTableId];
      Vue.set(state.userData.itemTables, destTableId, _.cloneDeep(toCopy));
    },
    [MUTATION.LOAD_USER_DATA](state) {
      const data = localStorage.getItem("app.userData");
      if (data) {
        const parsedData = JSON.parse(data);
        // validate (remove user fields that are present in read-only)
        for (let id in parsedData.itemTables) {
          if (id in state.readOnlyData.itemTables) {
            delete parsedData.itemTables[id];
          }
        }

        Vue.set(state, "userData", parsedData);
      }
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
    },
    [ACTION.INIT_APP]({ commit }) {
      commit(MUTATION.LOAD_USER_DATA);
    }
  },
  modules: {}
});
