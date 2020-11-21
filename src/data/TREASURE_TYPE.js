export const TREASURE_TYPE = {
  cp: "cp",
  sp: "sp",
  ep: "ep",
  gp: "gp",
  pp: "pp",
  gem: "gem",
  art: "art object",
  other: "other"
};

export const TREASURE_TYPE_LIST = Object.keys(TREASURE_TYPE).map(t => {
  return { text: TREASURE_TYPE[t], value: t }
})

// these are vuetify color strings
export const TREASURE_COLORS = {
  cp: "brown darken-1",
  sp: "grey darken-1",
  ep: "blue-grey lighten-1",
  gp: "yellow darken-3",
  pp: "grey ligthen-1"
};

export const ITEM_RARITY_COLORS = {
  common: "grey darken-2",
  uncommon: "green darken-3",
  rare: "light-blue darken-2",
  "very rare": "deep-purple darken-3",
  legendary: "amber darken-4"
};

export default TREASURE_TYPE;
