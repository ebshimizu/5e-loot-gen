<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" @click="test" />
  </div>
</template>

<script>
// @ is an alias to /src
import Items from "@/data/base-items";
import ItemTables from "@/data/base-item-tables";
import LootTables from "@/data/base-loot-tables";
import { lootGen } from "@/generator/loot-gen";

export default {
  name: "Home",
  components: {},
  methods: {
    test() {
      const loot = lootGen(
        [
          {
            lootTableId: "test",
            count: 3,
            filters: {
              excludeType: [],
              excludeId: []
            }
          }
        ],
        LootTables,
        ItemTables,
        Items
      );

      console.log(loot);
    }
  }
};
</script>
