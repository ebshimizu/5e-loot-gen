<template>
  <v-row>
    <v-col cols="5">
      <h2>Item Table List</h2>
      <v-data-table
        :items-per-page="-1"
        hide-default-footer
        :headers="headers"
        :items="tables"
      >
        <template v-slot:item.actions="{ item }">
          <v-tooltip top v-if="!item.readOnly">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                v-bind="attrs"
                v-on="on"
                @click="renameTable(item)"
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
                @click="deleteTable(item)"
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
      ]
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
    deleteTable(item) {
      this.$store.commit(MUTATION.DELETE_ITEM_TABLE, item.id);
    }
  }
};
</script>
