import Vue from "vue";
import VueRouter from "vue-router";
import Generator from "../views/Generator";
import ItemTableList from "../views/ItemTableList";
import ItemTableEdit from "../views/ItemTableEdit";

Vue.use(VueRouter);

// routes needed:
// - home (generator page)
// - edit loot tables (/lootTable/{table-id} for permanent linking?)
// - edit item tables (/itemTable/{table-id})
// - edit items (/items)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Generator
  },
  {
    path: "/itemTable",
    name: "Item Table",
    component: ItemTableList,
    children: [
      {
        path: ":slug",
        component: ItemTableEdit
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
