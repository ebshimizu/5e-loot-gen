<template>
  <v-row>
    <v-col cols="5">
      <h2>Item Table List</h2>
      <v-btn block color="primary" class="mb-2" @click.stop="showNewDialog"
        >Add Item Table</v-btn
      >
      <v-data-table
        :items-per-page="-1"
        hide-default-footer
        :headers="headers"
        :items="tables"
      >
        <template v-slot:item.actions="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                v-bind="attrs"
                v-on="on"
                @click.stop="showCopyDialog(item)"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          <v-tooltip top v-if="!item.readOnly">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                v-bind="attrs"
                v-on="on"
                @click.stop="showRenameDialog(item)"
              >
                <v-icon>mdi-file-edit</v-icon>
              </v-btn>
            </template>
            <span>Rename</span>
          </v-tooltip>
          <v-tooltip top v-if="!item.readOnly">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red"
                icon
                v-bind="attrs"
                v-on="on"
                @click.stop="showDeleteDialog(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="green"
                icon
                v-bind="attrs"
                v-on="on"
                :to="`/itemTable/${slug(item)}`"
              >
                <v-icon>{{ item.readOnly ? "mdi-eye" : "mdi-pencil" }}</v-icon>
              </v-btn>
            </template>
            <span>{{ item.readOnly ? "View" : "Edit" }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-col>
    <v-col cols="7">
      <router-view></router-view>
    </v-col>
    <v-dialog v-model="deleteDialog" max-width="350">
      <v-card>
        <v-card-title class="headline">
          Delete {{ activeItemTable }}?
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this table? This action is not
          undoable. Loot tables that use this item table will be automatically
          adjusted.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="deleteDialog = false">
            Cancel
          </v-btn>

          <v-btn color="primary" text @click="deleteTable(activeItemTable)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="renameDialog" max-width="450">
      <v-card>
        <v-card-title class="headline"
          >Rename {{ activeItemTable }}</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  v-model="nameInput"
                  label="Name"
                  hint="Names must be unique"
                  :error="nameError"
                  :error-messages="nameErrorMessages"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="renameDialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="renameTable(activeItemTable)"
          >
            Rename
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="newDialog" max-width="450">
      <v-card>
        <v-card-title class="headline">Create New Item Table</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  v-model="nameInput"
                  label="Name"
                  hint="Names must be unique"
                  :error="nameError"
                  :error-messages="nameErrorMessages"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="newDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="newItemTable">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="copyDialog" max-width="450">
      <v-card>
        <v-card-title class="headline">Copy {{ activeItemTable }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12"
                ><v-text-field
                  v-model="nameInput"
                  label="Copy To"
                  hint="Names must be unique"
                  :error="nameError"
                  :error-messages="nameErrorMessages"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="copyDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="copyTable(activeItemTable)">
            Copy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import slugify from "slugify";
import { MUTATION } from "../store/ACTIONS";

export default {
  name: "ItemTableList",
  data() {
    return {
      headers: [
        { text: "Name", value: "id" },
        { text: "Actions", value: "actions", sortable: false, align: "end" }
      ],
      activeItemTable: "",
      nameInput: "",
      deleteDialog: false,
      renameDialog: false,
      nameError: false,
      nameErrorMessages: "",
      newDialog: false,
      copyDialog: false
    };
  },
  computed: {
    tables() {
      return Object.keys(this.$store.getters.itemTables).map(id => {
        return {
          id,
          readOnly: id in this.$store.state.readOnlyData.itemTables
        };
      });
    }
  },
  methods: {
    slug(item) {
      return slugify(item.id);
    },
    deleteTable(id) {
      this.$store.commit(MUTATION.DELETE_ITEM_TABLE, id);
      this.deleteDialog = false;
    },
    showDeleteDialog(item) {
      this.activeItemTable = item.id;
      this.deleteDialog = true;
    },
    showRenameDialog(item) {
      this.activeItemTable = item.id;
      this.nameInput = item.id;
      this.nameError = false;
      this.nameErrorMessages = "";
      this.renameDialog = true;
    },
    renameTable(id) {
      // first, check for dupes
      const newSlug = slugify(this.nameInput);

      if (newSlug in this.$store.getters.itemTablesBySlug) {
        this.nameError = true;
        this.nameErrorMessages = "An Item Table with this name already exists.";
        return;
      }

      this.$store.commit(MUTATION.RENAME_ITEM_TABLE, {
        oldName: id,
        newName: this.nameInput
      });

      this.renameDialog = false;
    },
    showNewDialog() {
      this.nameInput = "";
      this.nameError = false;
      this.nameErrorMessages = "";
      this.newDialog = true;
    },
    newItemTable() {
      // first, check for dupes
      const newSlug = slugify(this.nameInput);

      if (newSlug in this.$store.getters.itemTablesBySlug) {
        this.nameError = true;
        this.nameErrorMessages = "An Item Table with this name already exists.";
        return;
      }

      this.$store.commit(MUTATION.ADD_ITEM_TABLE, this.nameInput);

      this.newDialog = false;
    },
    showCopyDialog(item) {
      this.nameInput = "";
      this.nameError = false;
      this.nameErrorMessages = "";
      this.activeItemTable = item.id;
      this.copyDialog = true;
    },
    copyTable(id) {
      // first, check for dupes
      const newSlug = slugify(this.nameInput);

      if (newSlug in this.$store.getters.itemTablesBySlug) {
        this.nameError = true;
        this.nameErrorMessages = "An Item Table with this name already exists.";
        return;
      }

      this.$store.commit(MUTATION.COPY_ITEM_TABLE, {
        srcTableId: id,
        destTableId: this.nameInput
      });

      this.copyDialog = false;
    }
  }
};
</script>
