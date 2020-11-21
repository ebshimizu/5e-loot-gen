<template>
  <div>
    <h2>{{ title }}</h2>
    <v-simple-table v-if="table">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Weight</th>
            <th>Item</th>
            <th>d100</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in table.table" :key="index + row.id">
            <td>
              <v-text-field
                type="number"
                v-model.number="row.weight"
                min="0"
                :disabled="readOnly"
                @input="val => update(index, row)"
              ></v-text-field>
            </td>
            <td>
              <v-autocomplete
                :items="$store.getters.itemsSelect"
                v-model="row.id"
                :disabled="readOnly"
                @input="val => update(index, row)"
              ></v-autocomplete>
            </td>
            <td>{{ d100Weights[index] }}</td>
            <td>
              <v-btn
                color="red"
                icon
                @click="() => deleteRow(index)"
                :disabled="readOnly"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">
              <v-btn color="primary" @click="addRow" :disabled="readOnly">
                Add Row
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import _ from "lodash";
import { MUTATION } from "../store/ACTIONS";

export default {
  name: "ItemTableEdit",
  data() {
    return {
      headers: [
        { text: "Weight", value: "weight", sortable: false },
        { text: "Item", value: "id", sortable: false },
        { text: "d100", value: "d100", sortable: false }
      ]
    };
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
  },
  computed: {
    table() {
      if (this.$route.params.slug in this.$store.getters.itemTablesBySlug) {
        return this.$store.getters.itemTablesBySlug[this.$route.params.slug];
      } else {
        return null;
      }
    },
    title() {
      if (this.table) {
        return this.table.id;
      } else {
        return "Unable to Locate Table";
      }
    },
    tableData() {
      if (this.table) {
        return this.table.table;
      } else {
        return [];
      }
    },
    readOnly() {
      return this.table.id in this.$store.state.readOnlyData.itemTables;
    },
    d100Weights() {
      // re-weights and assigns d100 rolls (approximately)
      const rolls = [];
      let total = 0;

      // first, get total weight
      for (const item of this.tableData) {
        total += item.weight;
      }

      // next, re-weight to be out of 100
      // floor to 1 (this will over-estimate some things but it's approximate)
      let currentWeight = 1;
      for (const item of this.tableData) {
        // re-weight, floor at 1
        let d100Weight = Math.max(Math.floor((item.weight / total) * 100), 1);

        const min = currentWeight;
        const max = currentWeight + (d100Weight - 1);
        currentWeight += d100Weight;

        // just push the format, it's a cosmetic thing
        rolls.push(
          `${min < 10 ? "0" : ""}${min}${min !== max ? ` - ${max}` : ""}`
        );
      }

      return rolls;
    }
  },
  methods: {
    debouncedUpdate(rowIndex, rowData) {
      this.$store.commit(MUTATION.UPDATE_ITEM_TABLE_ROW, {
        tableId: this.table.id,
        index: rowIndex,
        data: rowData
      });
    },
    addRow() {
      this.$store.commit(MUTATION.ADD_ITEM_TABLE_ROW, this.table.id);
    },
    deleteRow(rowIndex) {
      this.$store.commit(MUTATION.DELETE_ITEM_TABLE_ROW, {
        tableId: this.table.id,
        rowIndex
      });
    }
  }
};
</script>
