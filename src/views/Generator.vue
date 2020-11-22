<template>
  <v-row>
    <v-col cols="5">
      <h2>Generator Settings</h2>
      <v-row>
        <v-col cols="4">
          <v-text-field
            type="number"
            outlined
            label="Rolls"
            min="0"
            v-model.number="rolls"
          ></v-text-field>
        </v-col>
        <v-col cols="8">
          <v-select
            outlined
            label="Table to Roll On"
            :items="$store.getters.lootTableSelect"
            v-model="selectedTable"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            chips
            deletable-chips
            multiple
            outlined
            clearable
            label="Exclude Item Type"
            :items="$store.getters.itemTypeSelect"
            v-model="filters.excludeType"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-autocomplete
            chips
            deletable-chips
            multiple
            outlined
            clearable
            label="Exclude Items"
            :items="$store.getters.itemsSelect"
            v-model="filters.excludeId"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12">
          <v-btn color="green" block @click="generate">Generate Loot</v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="7">
      <v-row>
        <loot-card
          v-for="item in $store.state.history"
          :key="item.uuid"
          :lootEntry="item"
          v-on:repeat="repeat"
        ></loot-card>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import { ACTION } from "@/store/ACTIONS";

import LootCard from "./LootCard";

// import { lootGen } from "@/generator/loot-gen";

export default {
  name: "Generator",
  components: {
    LootCard
  },
  data() {
    return {
      selectedTable: this.$store.getters.lootTableSelect[0].value,
      rolls: 1,
      filters: {
        excludeType: [],
        excludeId: []
      }
    };
  },
  methods: {
    generate() {
      this.$store.dispatch(ACTION.GENERATE_LOOT, {
        table: this.selectedTable,
        rolls: this.rolls,
        filters: this.filters
      });
    },
    repeat({ rolls, filters, table }) {
      this.selectedTable = table;
      this.rolls = rolls;
      this.filters = filters;

      this.generate();
    }
  }
};
</script>
