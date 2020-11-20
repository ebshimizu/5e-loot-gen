<template>
  <v-col cols="12">
    <v-card>
      <v-app-bar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" icon>
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <span class="text-overline mr-2">Currency</span>
            <v-chip
              v-for="currency of totalTreasure"
              :key="currency.type"
              :color="currency.color"
              class="mr-1"
            >
              {{ currency.format }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <div class="text-overline">Items</div>
            <v-chip
              v-for="(item, id) of aggregateItems"
              :color="item.color"
              :key="id"
              class="ma-1"
            >
              {{ item.count }}x {{ id }}
            </v-chip>
          </v-col>
          <v-col>
            <v-btn block color="secondary" @click="showRawRolls = !showRawRolls"
              >Show Raw Rolls</v-btn
            >
          </v-col>
          <v-col cols="12" v-show="showRawRolls">
            <v-card
              flat
              outlined
              v-for="(item, idx) of lootEntry.loot"
              :key="idx"
              class="mb-1"
            >
              <v-card-title
                >Roll {{ item.meta.rollNumber }} on
                {{ item.meta.table }}</v-card-title
              >
              <v-card-text>{{ treasureList(item) }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { ITEM_RARITY_COLORS, TREASURE_COLORS } from "../data/TREASURE_TYPE";

export default {
  name: "LootCard",
  props: {
    lootEntry: Object
  },
  data() {
    return {
      showRawRolls: false
    };
  },
  computed: {
    title() {
      // format based on input
      // well, right now heterogeneous tables are illegal so...
      return `${this.lootEntry.input.rolls} roll${
        this.lootEntry.input.rolls === 1 ? "" : "s"
      } on the ${this.lootEntry.input.table} table`;
    },
    totalTreasure() {
      // note that this isn't the same as total value, as it excludes objects by default
      const currencies = {};
      for (const loot of this.lootEntry.loot) {
        for (const treasure of loot.treasure) {
          if (treasure.type in this.lootEntry.totalValue) {
            if (!(treasure.type in currencies)) {
              currencies[treasure.type] = 0;
            }

            currencies[treasure.type] += treasure.count;
          }
        }
      }

      const formattedCurrencies = {};
      for (const id in currencies) {
        formattedCurrencies[id] = {
          type: id,
          format: `${currencies[id]} ${id}`,
          color: TREASURE_COLORS[id]
        };
      }

      return formattedCurrencies;
    },
    aggregateItems() {
      // collects all items with same id
      const items = {};
      for (const loot of this.lootEntry.loot) {
        for (const item of loot.items) {
          if (!(item.itemId in items)) {
            const itemRarity = this.$store.getters.items[item.itemId].rarity;
            items[item.itemId] = {
              count: 0,
              color: ITEM_RARITY_COLORS[itemRarity]
            };
          }

          items[item.itemId].count += 1;
        }
      }

      return items;
    }
  },
  methods: {
    treasureList(loot) {
      // formats the loot object
      // list treasure first
      const items = [];
      for (const treasure of loot.treasure) {
        if (!(treasure.type in this.lootEntry.totalValue)) {
          // lil extra formatting
          const type = `${treasure.unitValue} gp ${treasure.type}${
            treasure.count === 1 ? "" : "s"
          }`;
          items.push(`${treasure.count} ${type}`);
        } else {
          items.push(`${treasure.count} ${treasure.type}`);
        }
      }

      for (const item of loot.items) {
        items.push(item.itemId);
      }

      return items.join(", ");
    }
  }
};
</script>
