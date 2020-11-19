import DICE from "../data/DICE";

// distribution is an array of objects that have at minimum a weight field.
// the weights are expected to add up to 1
function sampleWeightedDist(distribution) {
  const rng = Math.random();

  for (let i = 0; i < distribution.length - 1; i++) {
    // if rng is gt current and less than next, return current
    if (distribution[i].weight <= rng && rng < distribution[i + 1].weight) {
      return distribution[i];
    }
  }

  // otherwise, return last object
  return distribution[distribution.length - 1];
}

// assumes distribution is an array with each object having a weight param
function normalizeDistribution(distribution) {
  const total = distribution.map(o => o.weight).reduce((t, c) => t + c, 0);

  const normalized = [];
  let currentThreshold = 0;
  for (const origin of distribution) {
    const normWeight = origin.weight / total;

    normalized.push({
      ...origin,
      weight: currentThreshold
    });

    currentThreshold += normWeight;
  }
  return normalized;
}

/**
 * @param {Object} treasureRow Object containing the currency type, die size, die count, and unit value (an int, assumed to be gp)
 * @returns {Object} Object containing currency count, type, and unit value
 */
function rollTreasure(treasureRow) {
  // roll based on die size
  let count = 0;

  // get dice int from string key
  const dieSize = DICE[treasureRow.dieSize];
  for (let i = 0; i < treasureRow.dieCount; i++) {
    count += Math.floor(Math.random() * dieSize + 1); // +1 because we're one indexed here
  }

  // return the stuff
  return {
    count,
    type: treasureRow.type,
    unitValue: treasureRow.unitValue
  };
}

/**
 *
 * @param {Array} table Loot table to roll on
 * @param {Object} itemTables All available item tables, indexed by table id
 * @param {Object} items All available items, indexed by item name
 * @param {Object} filters Filters object (format still tbd a little)
 */
function rollLoot(table, itemTables, items, filters) {
  // first, roll on the overall table and get the line
  // the loot table is just an array of objects, each of which has a weight
  const row = sampleWeightedDist(normalizeDistribution(table));

  // each row has a treasure field and a item tables field
  const treasureRolls = [];

  // tracker for aggregation
  const liquidValue = {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0
  };

  // treasure is pretty easy, for each treasure entry, just roll it
  // treasure is a sparse table (duplicates don't matter we sum it)
  for (const treasureRow of row.treasure) {
    const treasureRoll = rollTreasure(treasureRow);
    treasureRolls.push(treasureRoll);

    // check if aggregate should use the unit value
    if (treasureRoll.type in liquidValue) {
      liquidValue[treasureRoll.type] += treasureRoll.count;
    } else {
      liquidValue.gp += treasureRoll.count * treasureRoll.unitValue;
    }
  }

  // then roll on the item tables, subject to the given filters
  const itemList = [];
  for (const itemRow of row.items) {
    // first, check that the table exists
    if (!(itemRow.itemTableId in itemTables)) {
      continue;
    }

    // determine how many rolls we get
    const dieSize = DICE[itemRow.dieSize];
    let itemRolls = 0;
    for (let i = 0; i < itemRow.dieCount; i++) {
      itemRolls += Math.floor(Math.random() * dieSize + 1);
    }

    // filter the table
    const filteredTable = itemTables[itemRow.itemTableId].filter(item => {
      const itemInfo = items[item.id];

      // if the item type is in the excluded item type list, we don't want it
      if (filters.excludeType.includes(itemInfo.type)) {
        return false;
      } else if (filters.excludeId.includes(item.id)) {
        return false;
      }

      return true;
    });

    if (filteredTable.length === 0) {
      console.log(`No items left in table ${itemRow.itemTableId}, skipping...`);
      continue;
    }

    const normalizedWeightTable = normalizeDistribution(filteredTable);

    // roll it
    for (let i = 0; i < itemRolls; i++) {
      const itemResult = sampleWeightedDist(normalizedWeightTable);

      // append to list of items
      itemList.push({
        itemId: itemResult.id,
        type: items[itemResult.id].type,
        meta: {
          itemTable: itemRow.itemTableId,
          rollNumber: i + 1
        }
      });
    }
  }

  return {
    treasure: treasureRolls,
    items: itemList,
    treasureValue: liquidValue
  };
}

/**
 *
 * @param {Object[]} rolls An array of objects containing the info needed to toll on a loot table.
 * Each object contains a lootTableId (which maps to lootTables), a count (int), and an optional filters param (an object)
 * @param {Object} lootTables Mapping from lootTableId to loot table object
 * @param {Object} itemTables Mapping from itemTableId to item table object
 * @param {Object} items List of items available, keyed by item name
 */
function lootGen(rolls, lootTables, itemTables, items) {
  // each roll is stored in a separate line
  // totals are computed at the end
  const loot = [];

  // for each roll on a table...
  for (const roll of rolls) {
    const tableId = roll.lootTableId;
    // check that the table actually exists, cont. if not
    if (!(tableId in lootTables)) {
      console.log(`Loot Table ID ${tableId} not fount, skipping rolls...`);
      continue;
    }

    // roll on the table roll.count number of times
    for (let i = 0; i < roll.count; i++) {
      const treasure = rollLoot(
        lootTables[tableId],
        itemTables,
        items,
        roll.filters
      );

      // append to loot, add some metadata
      treasure.meta = {
        rollNumber: i + 1
      };

      loot.push(treasure);
    }
  }

  // aggregate total value from treasureValue field
  const totalValue = {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0
  };

  for (const lootRow of loot) {
    for (const currency in totalValue) {
      totalValue[currency] += lootRow.treasureValue[currency];
    }
  }

  return { loot, totalValue };
}

export { lootGen };
