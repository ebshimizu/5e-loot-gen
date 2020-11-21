import { MUTATION } from "./ACTIONS";

export const Persistence = store => {
  store.subscribe(({ type }, state) => {
    if (type !== MUTATION.ADD_LOOT_HISTORY) {
      // persist user data
      localStorage.setItem("app.userData", JSON.stringify(state.userData));
    }
  });
};
