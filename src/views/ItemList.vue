<template>
  <div>
    <h2>Item List</h2>
    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:top>
        <v-toolbar flat>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            class="mb-2 mr-2"
            @click="showSRDItems = !showSRDItems"
          >
            {{ showSRDItems ? 'Show Custom Items Only' : 'Show All Items' }}
          </v-btn>
          <v-dialog v-model="newDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">New Item</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newItemName"
                        label="Item Name"
                        hint="Item names must be unique"
                        :error="newItemError"
                        :error-messages="newItemErrorMessages"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="resetNewDialog">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="addItem">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="deleteDialog = false"
                  >No</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItem"
                  >Yes</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.type="props">
        <v-edit-dialog
          :return-value.sync="props.item.type"
          :large="!readOnly(props.item.id)"
          :persistent="!readOnly(props.item.id)"
          @save="save(props.item)"
        >
          <div>{{ props.item.type }}</div>
          <template v-slot:input>
            <div class="mt-4 title">Update Type</div>
            <v-combobox
              v-model="props.item.type"
              label="Type"
              :items="itemTypes"
              :disabled="readOnly(props.item.id)"
            ></v-combobox>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.rarity="props">
        <v-edit-dialog
          :return-value.sync="props.item.rarity"
          :large="!readOnly(props.item.id)"
          :persistent="!readOnly(props.item.id)"
          @save="save(props.item)"
        >
          <div>{{ props.item.rarity }}</div>
          <template v-slot:input>
            <div class="mt-4 title">Update Rarity</div>
            <v-combobox
              v-model="props.item.rarity"
              label="Rarity"
              :items="rarities"
              :disabled="readOnly(props.item.id)"
            ></v-combobox>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          @click.stop="showDeleteDialog(item.id)"
          color="red"
          :disabled="readOnly(item.id)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { MUTATION } from '../store/ACTIONS';
export default {
  name: 'ItemList',
  data() {
    return {
      headers: [
        {
          text: 'Item Name (ID)',
          value: 'id',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Rarity',
          value: 'rarity',
        },
        {
          text: 'Actions',
          value: 'actions',
        },
      ],
      showSRDItems: false,
      newDialog: false,
      deleteDialog: false,
      newItemName: '',
      newItemError: false,
      newItemErrorMessages: '',
      selectedItemId: '',
      rarities: ['common', 'uncommon', 'rare', 'very rare', 'legendary'],
      search: '',
    };
  },
  computed: {
    items() {
      if (this.showSRDItems) {
        return Object.values(this.$store.getters.items);
      } else {
        return Object.values(this.$store.state.userData.items);
      }
    },
    itemTypes() {
      return this.$store.getters.itemTypeSelect.map((i) => i.text);
    },
  },
  methods: {
    readOnly(itemId) {
      return itemId in this.$store.state.readOnlyData.items;
    },
    save(item) {
      // what is the input here?
      this.$store.commit(MUTATION.UPDATE_ITEM, item);
    },
    addItem() {
      // name check
      if (this.newItemName in this.$store.getters.items) {
        this.newItemError = true;
        this.newItemErrorMessages = 'An item with this name already exists.';
        return;
      }

      this.$store.commit(MUTATION.ADD_ITEM, this.newItemName);
      this.resetNewDialog();
    },
    resetNewDialog() {
      this.newDialog = false;
      this.newItemName = '';
      this.newItemError = false;
      this.newItemErrorMessages = '';
    },
    showDeleteDialog(itemId) {
      this.selectedItemId = itemId;
      this.deleteDialog = true;
    },
    deleteItem() {
      this.$store.commit(MUTATION.DELETE_ITEM, this.selectedItemId);
      this.deleteDialog = false;
    },
  },
};
</script>
