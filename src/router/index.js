import Vue from "vue";
import VueRouter from "vue-router";
import Generator from "../views/Generator";

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
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
