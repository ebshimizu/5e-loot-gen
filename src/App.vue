<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>5e Loot Generator</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>5e Loot Generator</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item link to="/"
          ><v-list-item-content
            ><v-list-item-title
              >Generate</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item link to="/lootTable"
          ><v-list-item-content
            ><v-list-item-title
              >Edit Loot Tables</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
        <v-list-item link to="/itemTable"
          ><v-list-item-content
            ><v-list-item-title
              >Edit Item Tables</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
        <v-list-item link
          ><v-list-item-content
            ><v-list-item-title
              >Edit Item Pool</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ACTION } from "./store/ACTIONS";

export default {
  name: "App",

  components: {},

  data() {
    return {
      drawer: false
    };
  },

  beforeCreate() {
    this.$store.dispatch(ACTION.INIT_APP);
  }
};
</script>

<style lang="scss">
</style>
