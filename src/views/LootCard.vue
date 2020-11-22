<template>
  <v-col cols="12">
    <v-card>
      <v-app-bar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="white" icon v-bind="attrs" v-on="on" @click="repeat">
              <v-icon>mdi-repeat</v-icon>
            </v-btn>
          </template>
          <span>Run Again</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="white"
              icon
              v-bind="attrs"
              v-on="on"
              @click="copyToClipboard"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>Copy to Clipboard</span>
        </v-tooltip>
      </v-app-bar>
      <v-card-text>
        <v-row>
          <v-col cols="12" v-if="Object.keys(totalTreasure).length > 0">
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
          <v-col cols="12" v-if="Object.keys(aggregateItems).length > 0">
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
          <v-col cols="12" v-if="filtersUsed">
            <div class="text-overline">Active Filters</div>
            {{ filters }}
          </v-col>
          <v-col>
            <v-btn block color="secondary" @click="showRawRolls = !showRawRolls"
              >Show Individual Rolls</v-btn
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
              <v-card-subtitle>{{
                formatRow(item.selectedRow)
              }}</v-card-subtitle>
              <v-card-text>{{ treasureList(item) }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { ITEM_RARITY_COLORS, TREASURE_COLORS } from '../data/TREASURE_TYPE';
import copy from 'copy-to-clipboard';

export default {
  name: 'LootCard',
  props: {
    lootEntry: Object,
  },
  data() {
    return {
      showRawRolls: false,
    };
  },
  computed: {
    title() {
      // format based on input
      // well, right now heterogeneous tables are illegal so...
      return `${this.lootEntry.input.rolls} roll${
        this.lootEntry.input.rolls === 1 ? '' : 's'
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
          color: TREASURE_COLORS[id],
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
              color: ITEM_RARITY_COLORS[itemRarity],
            };
          }

          items[item.itemId].count += 1;
        }

        for (const treasure of loot.treasure) {
          if (!(treasure.type in this.lootEntry.totalValue)) {
            const treasureId = `${treasure.unitValue} gp ${treasure.type}s`;
            if (!(treasureId in items)) {
              items[treasureId] = {
                count: 0,
                color: 'pink darken-4',
              };
            }

            items[treasureId].count += treasure.count;
          }
        }
      }

      return items;
    },
    filtersUsed() {
      return (
        this.lootEntry.input.filters.excludeType.length > 0 ||
        this.lootEntry.input.filters.excludeId.length > 0
      );
    },
    filters() {
      const formatted = [];
      for (const filter of this.lootEntry.input.filters.excludeType) {
        formatted.push(`No ${filter}s`);
      }

      for (const filter of this.lootEntry.input.filters.excludeId) {
        formatted.push(`No ${filter}`);
      }

      return formatted.join(', ');
    },
  },
  methods: {
    formatRow(row) {
      // puts the treasure table row into a readable string format.
      // just concats the treasure, items, and stuff
      const lines = [];
      for (const treasure of row.treasure) {
        if (!(treasure.type in this.lootEntry.totalValue)) {
          lines.push(
            `${treasure.dieCount}${treasure.dieSize} x ${treasure.multiplier} ${treasure.type}`
          );
        } else {
          lines.push(
            `${treasure.dieCount}${treasure.dieSize} x ${treasure.multiplier} ${treasure.unitValue} gp ${treasure.type}s`
          );
        }
      }

      // items
      for (const item of row.items) {
        lines.push(
          `${item.dieCount}${item.dieSize} rolls on ${item.itemTableId}`
        );
      }

      return `[Weight ${row.originalWeight}]${lines.length > 0 ? ` ${lines.join(', ')}` : ''}`;
    },
    treasureList(loot) {
      // formats the loot object
      // list treasure first
      const items = [];
      for (const treasure of loot.treasure) {
        if (!(treasure.type in this.lootEntry.totalValue)) {
          // lil extra formatting
          const type = `${treasure.unitValue} gp ${treasure.type}${
            treasure.count === 1 ? '' : 's'
          }`;
          items.push(`${treasure.count} ${type}`);
        } else {
          items.push(`${treasure.count} ${treasure.type}`);
        }
      }

      for (const item of loot.items) {
        items.push(item.itemId);
      }

      return items.join(', ');
    },
    copyToClipboard() {
      // concat all the aggregated things
      const items = [];
      for (const type in this.totalTreasure) {
        items.push(this.totalTreasure[type].format);
      }

      for (const id in this.aggregateItems) {
        const item = this.aggregateItems[id];
        items.push(`${item.count}x ${id}`);
      }

      copy(items.join(', '));
    },
    repeat() {
      this.$emit('repeat', this.lootEntry.input);
    },
  },
};
</script>
