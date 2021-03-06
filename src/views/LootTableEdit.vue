<template>
  <div>
    <h2>{{ title }}{{ readOnly ? ' [Read Only]' : '' }}</h2>
    <v-card elevation="2" outlined class="mb-2" v-if="table">
      <v-card-title>Global Treasure</v-card-title>
      <v-card-text>
        <v-row
          v-for="(treasure, index) in tableData.globalTreasure"
          :key="index"
        >
          <v-col cols="2">
            <v-text-field
              type="number"
              v-model.number="tableData.globalTreasure[index].dieCount"
              label="Count"
              min="1"
              :disabled="readOnly"
              @input="updateGlobalTreasure()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              :items="diceSizes"
              v-model="tableData.globalTreasure[index].dieSize"
              label="Die Size"
              :disabled="readOnly"
              @input="updateGlobalTreasure()"
            >
            </v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field
              type="number"
              v-model.number="tableData.globalTreasure[index].multiplier"
              label="Multiplier"
              min="1"
              :disabled="readOnly"
              prepend-icon="mdi-close"
              @input="updateGlobalTreasure()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              :items="treasureTypes"
              v-model="tableData.globalTreasure[index].type"
              label="Type"
              :disabled="readOnly"
              @input="updateGlobalTreasure()"
            >
            </v-select
          ></v-col>
          <v-col cols="2">
            <v-text-field
              type="number"
              v-model.number="tableData.globalTreasure[index].unitValue"
              label="Unit Value"
              min="1"
              :disabled="readOnly"
              @input="updateGlobalTreasure()"
            >
            </v-text-field>
          </v-col>
          <v-col cols="1" class="d-flex justify-center align-center">
            <v-btn
              color="red"
              icon
              @click="deleteGlobalTreasureRow(index)"
              :disabled="readOnly"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-btn
          color="green"
          @click="addGlobalTreasureRow()"
          :disabled="readOnly"
        >
          Add Row
        </v-btn>
      </v-card-text>
    </v-card>
    <v-simple-table v-if="table">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Weight</th>
            <th>Treasure</th>
            <th>Items</th>
            <th>d100</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData.table" :key="row.uuid">
            <td>
              <v-text-field
                type="number"
                v-model.number="row.weight"
                min="0"
                :disabled="readOnly"
                @input="(val) => update(index, row)"
              ></v-text-field>
            </td>
            <td @click.stop="showTreasureEdit(index, row)" class="editable">
              {{ renderTreasure(row) }}
            </td>
            <td @click.stop="showItemEdit(index, row)" class="editable">
              {{ renderItems(row) }}
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
            <td colspan="5">
              <v-btn color="primary" @click="addRow" :disabled="readOnly">
                Add Row
              </v-btn>
            </td>
          </tr>
        </tfoot>
      </template>
    </v-simple-table>
    <v-dialog v-model="treasureEditDialog" max-width="800">
      <v-card>
        <v-card-title class="headline">Editing Treasure Value</v-card-title>
        <v-card-text>
          <v-row
            v-for="(treasure, index) in activeRow.treasure"
            :key="`${activeRow.uuid}-t-${index}`"
          >
            <v-col cols="2">
              <v-text-field
                type="number"
                v-model.number="activeRow.treasure[index].dieCount"
                label="Count"
                min="1"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                :items="diceSizes"
                v-model="activeRow.treasure[index].dieSize"
                label="Die Size"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field
                type="number"
                v-model.number="activeRow.treasure[index].multiplier"
                label="Multiplier"
                min="1"
                :disabled="readOnly"
                prepend-icon="mdi-close"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select
                :items="treasureTypes"
                v-model="activeRow.treasure[index].type"
                label="Type"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-select
            ></v-col>
            <v-col cols="2">
              <v-text-field
                type="number"
                v-model.number="activeRow.treasure[index].unitValue"
                label="Unit Value"
                min="1"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-text-field>
            </v-col>
            <v-col cols="1" class="d-flex justify-center align-center">
              <v-btn
                color="red"
                icon
                @click="deleteTreasureRow(index)"
                :disabled="readOnly"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-btn color="green" @click="addTreasureRow()" :disabled="readOnly">
            Add Row
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="treasureEditDialog = false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="itemEditDialog" max-width="800">
      <v-card>
        <v-card-title class="headline">Editing Item Value</v-card-title>
        <v-card-text>
          <v-row
            v-for="(treasure, index) in activeRow.items"
            :key="`${activeRow.uuid}-i-${index}`"
          >
            <v-col cols="2">
              <v-text-field
                type="number"
                v-model.number="activeRow.items[index].dieCount"
                label="Count"
                min="1"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-text-field>
            </v-col>
            <v-col cols="2">
              <v-select
                :items="diceSizes"
                v-model="activeRow.items[index].dieSize"
                label="Die Size"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-select>
            </v-col>
            <v-col cols="7">
              <v-select
                :items="itemTables"
                v-model="activeRow.items[index].itemTableId"
                label="Item Table"
                :disabled="readOnly"
                @input="() => update(activeIndex, activeRow)"
              >
              </v-select
            ></v-col>
            <v-col cols="1" class="d-flex justify-center align-center">
              <v-btn
                color="red"
                icon
                @click="deleteItemRow(index)"
                :disabled="readOnly"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-btn color="green" @click="addItemRow()" :disabled="readOnly">
            Add Row
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="itemEditDialog = false">
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import { MUTATION } from '../store/ACTIONS';
import { DICE_SELECT } from '../data/DICE';
import { TREASURE_TYPE_LIST, TREASURE_TYPE } from '../data/TREASURE_TYPE';

export default {
  name: 'ItemTableEdit',
  data() {
    return {
      headers: [
        { text: 'Weight', value: 'weight', sortable: false },
        { text: 'Item', value: 'id', sortable: false },
        { text: 'd100', value: 'd100', sortable: false },
      ],
      diceSizes: DICE_SELECT,
      treasureTypes: TREASURE_TYPE_LIST,
      activeRow: {},
      activeIndex: 0,
      treasureEditDialog: false,
      itemEditDialog: false,
    };
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
    this.updateGlobalTreasure = _.debounce(this.debouncedGlobalUpdate, 250);
  },
  computed: {
    table() {
      if (this.$route.params.slug in this.$store.getters.lootTablesBySlug) {
        return this.$store.getters.lootTablesBySlug[this.$route.params.slug];
      } else {
        return null;
      }
    },
    title() {
      if (this.table) {
        return this.table.id;
      } else {
        return 'Unable to Locate Table';
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
      return this.table.id in this.$store.state.readOnlyData.lootTables;
    },
    d100Weights() {
      // re-weights and assigns d100 rolls (approximately)
      const rolls = [];
      let total = 0;

      // first, get total weight
      for (const item of this.tableData.table) {
        total += item.weight;
      }

      // next, re-weight to be out of 100
      // floor to 1 (this will over-estimate some things but it's approximate)
      let currentWeight = 1;
      for (const item of this.tableData.table) {
        // re-weight, floor at 1
        let d100Weight = Math.max(Math.floor((item.weight / total) * 100), 1);

        const min = currentWeight;
        const max = currentWeight + (d100Weight - 1);
        currentWeight += d100Weight;

        // just push the format, it's a cosmetic thing
        rolls.push(
          `${min < 10 ? '0' : ''}${min}${min !== max ? ` - ${max}` : ''}`
        );
      }

      return rolls;
    },
    itemTables() {
      return this.$store.getters.itemTableSelect;
    },
  },
  methods: {
    debouncedUpdate(rowIndex, rowData) {
      this.$store.commit(MUTATION.UPDATE_LOOT_TABLE_ROW, {
        tableId: this.table.id,
        index: rowIndex,
        data: rowData,
      });
    },
    debouncedGlobalUpdate() {
      this.$store.commit(MUTATION.UPDATE_LOOT_TABLE_GLOBAL, {
        tableId: this.table.id,
        globalTreasure: this.tableData.globalTreasure,
      });
    },
    addRow() {
      this.$store.commit(MUTATION.ADD_LOOT_TABLE_ROW, this.table.id);
    },
    deleteRow(rowIndex) {
      this.$store.commit(MUTATION.DELETE_LOOT_TABLE_ROW, {
        tableId: this.table.id,
        rowIndex,
      });
    },
    showTreasureEdit(index, row) {
      this.activeIndex = index;
      this.activeRow = row;
      this.treasureEditDialog = true;
    },
    showItemEdit(index, row) {
      this.activeIndex = index;
      this.activeRow = row;
      this.itemEditDialog = true;
    },
    renderTreasure(row) {
      // string version of the treasure entries
      const formatted = [];
      for (const treasure of row.treasure) {
        let type = treasure.type;

        if (
          treasure.type === 'gem' ||
          treasure.type === 'art' ||
          treasure.type === 'other'
        ) {
          type = `${treasure.unitValue}gp ${TREASURE_TYPE[treasure.type]}s`;
        }

        formatted.push(
          `${treasure.dieCount}${treasure.dieSize} x ${treasure.multiplier} ${type}`
        );
      }

      if (formatted.length > 0) return formatted.join(', ');
      else return '----';
    },
    renderItems(row) {
      const formatted = [];
      for (const item of row.items) {
        formatted.push(
          `${item.dieCount}${item.dieSize} rolls on ${item.itemTableId}`
        );
      }

      if (formatted.length > 0) return formatted.join(', ');
      else return '----';
    },
    deleteTreasureRow(index) {
      this.activeRow.treasure.splice(index, 1);
      this.update(this.activeIndex, this.activeRow);
    },
    addTreasureRow() {
      this.activeRow.treasure.push({
        type: 'gp',
        dieSize: 'd6',
        dieCount: 1,
        multiplier: 1,
        unitValue: 1,
      });
      this.update(this.activeIndex, this.activeRow);
    },
    deleteItemRow(index) {
      this.activeRow.items.splice(index, 1);
      this.update(this.activeIndex, this.activeRow);
    },
    addItemRow() {
      this.activeRow.items.push({
        itemTableId: this.itemTables[0].value,
        dieCount: 1,
        dieSize: 'd4',
      });
      this.update(this.activeIndex, this.activeRow);
    },
    addGlobalTreasureRow() {
      this.tableData.globalTreasure.push({
        type: 'gp',
        dieSize: 'd6',
        dieCount: 1,
        multiplier: 1,
        unitValue: 1,
      });
      this.debouncedGlobalUpdate();
    },
    deleteGlobalTreasureRow(index) {
      this.tableData.globalTreasure.splice(index, 1);
      this.debouncedGlobalUpdate();
    },
  },
};
</script>

<style scoped>
.editable:hover {
  cursor: pointer;
  background-color: darkgoldenrod;
}
</style>
