<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>5e Loot Generator</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary app>
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
        <v-subheader>CUSTOMIZATION</v-subheader>
        <v-list-item to="/lootTable"
          ><v-list-item-content
            ><v-list-item-title
              >Edit Loot Tables</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
        <v-list-item to="/itemTable"
          ><v-list-item-content
            ><v-list-item-title
              >Edit Item Tables</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
        <v-list-item to="/items"
          ><v-list-item-content
            ><v-list-item-title
              >Edit Item Pool</v-list-item-title
            ></v-list-item-content
          ></v-list-item
        >
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-subheader>OTHER TOOLS</v-subheader>
        <v-list-item href="https://ebshimizu.github.io/5emm/"
          ><v-list-item-content
            ><v-list-item-title
              >5e Monster Maker</v-list-item-title
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

    <v-footer app padless>
      <v-card flat tile width="100%">
        <v-card-text class="py-1 white--text text-center">
          <span @click.stop="oglDialog = true" class="ogl-link"
            >Open Gaming Licence</span
          >
          | v{{ $store.getters.majorVersion }}.{{
            $store.getters.minorVersion
          }}
          build {{ $store.state.buildNumber }} | Created by
          <strong>Falindrith</strong> |
          <v-btn icon class="mx-1" href="https://twitter.com/falindrith"
            ><v-icon>mdi-twitter</v-icon></v-btn
          >
          <v-btn
            icon
            class="mr-1"
            href="https://github.com/ebshimizu/5e-loot-gen"
            ><v-icon size="24px">mdi-github</v-icon></v-btn
          >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon href="https://ko-fi.com/E1E2KHZ3"
                ><v-avatar size="36px"
                  ><img src="./assets/ko-fi-icon.png"/></v-avatar
              ></v-btn>
            </template>
            Tip Jar
          </v-tooltip>
        </v-card-text>
      </v-card>
      <v-dialog v-model="oglDialog" max-width="800px">
        <v-card>
          <v-card-title>Open Gaming Licence Content</v-card-title>
          <v-card-subtitle
            >Some content used under the following license:</v-card-subtitle
          >
          <v-card-text v-html="oglText"></v-card-text>
        </v-card>
      </v-dialog>
    </v-footer>
  </v-app>
</template>

<script>
import { ACTION } from './store/ACTIONS';

export default {
  name: 'App',

  components: {},

  data() {
    return {
      drawer: false,
    };
  },

  beforeCreate() {
    this.$store.dispatch(ACTION.INIT_APP);
  },
};
</script>

<style lang="scss"></style>
