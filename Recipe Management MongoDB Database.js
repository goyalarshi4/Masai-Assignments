//Recipe Management MongoDB Database//
// 1. Retrieve all recipes with cuisine "Italian"
db.recipes.find({ cuisine: "Italian" });

// 2. Retrieve all recipes with a prep_time less than 30 minutes
db.recipes.find({ prep_time: { $lt: 30 } });

// 3. Retrieve all recipes where the price is greater than 500
db.recipes.find({ price: { $gt: 500 } });

// 4. Retrieve all recipes sorted by price in ascending order
db.recipes.find().sort({ price: 1 });

// 5. Update the price of the recipe with recipe_id: 2 (Chicken Biryani) to 900
db.recipes.updateOne(
  { recipe_id: 2 },
  { $set: { price: 900 } }
);

// 6. Retrieve only the name and price fields for all recipes
db.recipes.find({}, { name: 1, price: 1, _id: 0 });

// 7. Retrieve all recipes where difficulty is "medium" and price is less than 600
db.recipes.find({ difficulty: "medium", price: { $lt: 600 } });

// 8. Retrieve all recipes sorted by prep_time in descending order
db.recipes.find().sort({ prep_time: -1 });

// 9. Insert a new recipe (Chocolate Cake)
db.recipes.insertOne({
  recipe_id: 11,
  name: "Chocolate Cake",
  ingredients: ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Butter"],
  cuisine: "American",
  prep_time: 50,
  difficulty: "medium",
  price: 750
});

// 10. Delete the recipe with recipe_id: 4 (Caesar Salad)
db.recipes.deleteOne({ recipe_id: 4 });

// 11. Retrieve all recipes with cuisine "Japanese" or "Thai"
db.recipes.find({ cuisine: { $in: ["Japanese", "Thai"] } });

// 12. Retrieve all recipes where the ingredients include "Egg"
db.recipes.find({ ingredients: "Egg" });

// 13. Update the prep_time of the recipe with recipe_id: 7 (Pad Thai) to 35 minutes
db.recipes.updateOne(
  { recipe_id: 7 },
  { $set: { prep_time: 35 } }
);

// 14. Delete all recipes where the price is greater than 1000
db.recipes.deleteMany({ price: { $gt: 1000 } });

// 15. Retrieve the first 3 recipes using the limit function
db.recipes.find().limit(3);

// 16. Skip the first 2 recipes and retrieve the rest
db.recipes.find().skip(2);

// 17. Retrieve all recipes with cuisine "Thai" and sort them by price in descending order
db.recipes.find({ cuisine: "Thai" }).sort({ price: -1 });

// 18. Insert another new recipe (Hummus)
db.recipes.insertOne({
  recipe_id: 12,
  name: "Hummus",
  ingredients: ["Chickpeas", "Tahini", "Garlic", "Olive Oil", "Lemon Juice"],
  cuisine: "Middle Eastern",
  prep_time: 15,
  difficulty: "easy",
  price: 300
});

// 19. Count the number of recipes with difficulty "easy"
db.recipes.countDocuments({ difficulty: "easy" });

// 20. Retrieve all recipes with a prep_time greater than 40 minutes
db.recipes.find({ prep_time: { $gt: 40 } });
