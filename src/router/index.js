import Vue from 'vue';
import VueRouter from 'vue-router';
import Generator from '../views/Generator';
import ItemTableList from '../views/ItemTableList';
import ItemTableEdit from '../views/ItemTableEdit';
import LootTableList from '../views/LootTableList';
import LootTableEdit from '../views/LootTableEdit';
import ItemList from "../views/ItemList";

Vue.use(VueRouter);

// routes needed:
// - home (generator page)
// - edit loot tables (/lootTable/{table-id} for permanent linking?)
// - edit item tables (/itemTable/{table-id})
// - edit items (/items)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Generator,
  },
  {
    path: '/itemTable',
    name: 'Item Table',
    component: ItemTableList,
    children: [
      {
        path: ':slug',
        component: ItemTableEdit,
      },
    ],
  },
  {
    path: '/lootTable',
    name: 'Loot Table',
    component: LootTableList,
    children: [
      {
        path: ':slug',
        component: LootTableEdit,
      },
    ],
  },
  {
    path: '/items',
    name: 'Items',
    component: ItemList
  }
];

const router = new VueRouter({
  routes,
});

export default router;
