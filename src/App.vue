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
        <v-list-item link @click="exportUserData">
          <v-list-item-content>
            <v-list-item-title>Export User Data</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click.stop="importDialog = true">
          <v-list-item-content>
            <v-list-item-title>Import User Data</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click.stop="deleteDialog = true">
          <v-list-item-content>
            <v-list-item-title>Delete All User Data</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
      <v-dialog v-model="deleteDialog" max-width="300px">
        <v-card
          ><v-card-title class="headline">Delete All User Data</v-card-title>
          <v-card-text
            >Are you sure you want to reset all of your custom data? This is not
            undoable. You may want to export your data before you do
            this.</v-card-text
          >
          <v-card-actions>
            <v-btn text @click="deleteUserData">Yes</v-btn>
            <v-btn text @click="deleteDialog = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="importDialog" persistent max-width="500px">
        <v-card>
          <v-card-title
            ><span class="headline">Load User Data</span></v-card-title
          >
          <v-card-text>
            Select a 5e Loot Generator .json file.
            <v-row>
              <v-col>
                <v-file-input
                  v-model="file"
                  :loading="fileLoading"
                  accept=".json"
                  label="Load File"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="importDialog = false"
              >Cancel</v-btn
            >
            <v-btn color="green darken-1" text @click="loadFile">Load</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

    <v-snackbar
      v-model="messageBar"
      :color="messageBarColor"
      app
      timeout="6000"
      bottom
      >{{ messageText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="messageBar = false">
          Close
        </v-btn></template
      ></v-snackbar
    >
  </v-app>
</template>

<script>
import { ACTION, MUTATION } from './store/ACTIONS';
import ogl from './data/OGL.txt';

export default {
  name: 'App',

  components: {},

  data() {
    return {
      drawer: false,
      oglDialog: false,
      oglText: ogl.replace(/\n/g, '<br />'),
      deleteDialog: false,
      importDialog: false,
      fileLoading: false,
      file: null,
      messageBar: false,
      messageBarColor: 'green',
      messageText: '',
    };
  },

  beforeCreate() {
    this.$store.dispatch(ACTION.INIT_APP);
  },
  methods: {
    download(content, filename, contentType) {
      var a = document.createElement('a');
      var file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();
    },
    exportUserData() {
      // just dump the object from state
      const userData = JSON.stringify(
        {
          ...this.$store.state.userData,
          version: this.$store.getters.majorVersion,
        },
        null,
        2
      );
      this.download(userData, '5e-loot-gen-user-data.json', 'application/json');
    },
    deleteUserData() {
      this.$store.commit(MUTATION.DELETE_ALL_USER_DATA);
      this.deleteDialog = false;
    },
    loadFile() {
      this.fileLoading = true;

      // really this should be validated but i'm skipping for now, as i don't see that many people using this.
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        try {
          const userData = JSON.parse(e.target.result);

          this.$store.commit(MUTATION.IMPORT_USER_DATA, userData);
          this.message('Load Successful', 'green');

          this.importDialog = false;
          this.loadCleanup();
        } catch (e) {
          console.log(e);
          this.importDialog = false;

          this.message('Load Failed', 'red');
          this.loadCleanup();
        }
      });

      reader.addEventListener('error', () => {
        console.log('Upload error');
        this.importDialog = false;

        this.message('Load Failed', 'red');
        this.loadCleanup();
      });

      reader.readAsText(this.file);
    },
    message(message, color) {
      this.messageBarColor = color;
      this.messageText = message;
      this.messageBar = true;
    },
    loadCleanup() {
      this.fileLoading = false;
      this.file = null;
    },
  },
};
</script>

<style lang="scss">
.ogl-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
