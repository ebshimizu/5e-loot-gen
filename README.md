# 5e Loot Gen
Live site: https://ebshimizu.github.io/loot-gen/

A loot generator for the 5th edition of Dungeons and Dragons. 

![5e Loot Gen Screenshot](https://ebshimizu.github.io/loot-gen/readme-screenshot.png)

## Features
- Quickly generate treasure with the preset tables, based off of those found in the Dungeon Master's Guide
- Easily filter out item types or specific items from the loot pools, without needing to edit the tables
- Customization: Edit loot tables with the built-in editor
  - Add your own loot tables, or edit the existing ones
  - Item tables can be added or edited
  - Custom items can be added
  - Import and export custom item lists and tables

## Customization Options

The application provides editing capabilities for three types of data: Items, Item Tables, and Loot Tables. Items are listed in Item Tables, which are in turn used by Loot Tables. This structure should be familiar to those who have generated loot by using the tables in the Dungeon Master's Guide.

### Adding Items

Items can be added by going to the `Edit Item Pool` option in the menu. To create an item, click the `New Item` button and enter an item name. Item names must be unique (although they are case-sensitive so "My Item" will be seen as unique from "my item" by the app). Once added, you can change the item type and rarity by clicking on those fields in the table. Only user-added items can be edited in this way. 
Note that item IDs cannot be changed once added. If you need to rename an item, you will need to delete it and add it again.

### Editing Item Tables

Item tables consist of a list of item IDs and weights indicating the chance that a given item will be selected when rolling on the table. The app includes a set of default item tables, which are used by the default loot tables. You can view the built-in tables, but not edit them. If you want to edit one of these tables, you should copy it first.

Each row of an item table is mostly self explanatory: you enter a weight and item ID. The weights do not need to add up to 100 or any other target. The d100 column is shown to help visualize probabilities. Note that this column might not end up at exactly 100 due to rounding. Once created, item tables can be used by the loot tables.

### Editing Loot Tables

Loot tables user item tables and treasure entries to generate a set of loot based on random die rolls. When generating loot, a random row in the loot table is selected (with selection frequency proportional to the row's weight). The generator will then generate loot according to the Global Treasure listed in the table (if any), and then generate loot according to the row's rules. A row in a loot table can contain a random amount of treasure and a random number of rolls on one or more item tables. For an example of what this data looks like, take a look at one of the preset tables, such as the [Hoard CR 5-10 Table](https://ebshimizu.github.io/loot-gen/#/lootTable/Hoard-CR-5-10).

When editing a loot table, note that global treasure is added at the top of the interface and can be left blank if you do not want this to apply to your table. Individual rows contain a weight (which does not have to sum to 100), a treasure field, and an items field. To edit the values of the treasure and item fields, click on the cell in the table and use the editor provided in the popup window.

Note that in order to use custom item tables in the default loot tables, you will first need to copy an existing loot table and update the item fields for each row.

### Import and Export

User data can be imported and exported by using the corresponding options in the menu. When importing data, existing items, item tables, and loot tables that share an id with imported data will be **overwritten**, so be careful if you're duplicating entries. The exported data is in plain JSON format, and can be edited if ids need to be de-duplicated.

## Notes and Details

### Item Names
Item names for the default tables are SRD-compliant. Some items may have different names in published sources.

### What Happens When Items Are Excluded?
When an item type or item id is filtered by the generator, any row that contains an item with a filtered id or type is removed from the loot sampler before items are sampled. All other rows (and the row weights) are left untouched. This means that the remaining items are sampled proportionally to their weight, and that an item *will* be returned by the sampler (instead of possibly returning nothing if a filtered item was selected). This will over-represent unfiltered items in the generated loot pool, but if you're filtering out specific items the assumption is that you will want *an* item to be returned.

## Development
This project was built with Vue v2. The standard `yarn install` followed by `yarn serve` to run the test server should get you up and running.