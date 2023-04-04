const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');

exports.createRecipe = async(req,res) => {
    try{
        // Check if user is logged in
        const user = await User.findById(req.user._id);

        if(!user){
          return res.status(400).json({ message: 'Please log in first!' });
        }
        const { title, description, ingredients, instructions, cookTime, difficulty, recImage, videoTutorial, category } = req.body;
        
        if (!title || !description || !ingredients || !instructions || !cookTime || !difficulty || !category) {
          return res.status(400).json({ message: "Missing required fields." });
        } 

        let recipeCategory;

        // Check if the provided category exists

        const existingCategory = await Category.findOne({ name: category.toLowerCase() });

        if (existingCategory) {
            recipeCategory = existingCategory;
        } else {
          return res.status(400).json({ message: 'Please choose between these categories( breakfast, lunch, dinner, snack, dessert, others' }); 
         }
        
        // Check if cookTime is a string
        if (typeof cookTime !== 'string' || typeof title !== 'string' || typeof description !== 'string') {
          return res.status(400).json({ message: 'Cook time, title, description must be a string.' }); 
        }

        // Check if ingredients name is a string and quantity is a number
        for (const ingredient of ingredients) {

          if (typeof ingredient.name !== 'string') {
            return res.status(400).json({ message: 'ingredient name must be a string.' });
          }

          if (isNaN(ingredient.quantity)) {
              return res.status(400).json({ message: 'Ingredient quantity must be a number.' });
          }

        }

        //check difficulty
        if (difficulty.toLowerCase() !== 'easy' && difficulty.toLowerCase() !== 'medium' && difficulty.toLowerCase() !== 'hard') {
            return res.status(400).json({ message: 'difficulty (easy, medium or hard).' });
        }

        const newRecipe = await Recipe.create({

          title,
          author: req.user._id,
          description,
          ingredients,
          instructions,
          cookTime,
          difficulty: difficulty.toLowerCase(),
          recImage,
          videoTutorial,
          category : recipeCategory._id
        });
        
        recipeCategory.recipes.push(newRecipe._id);

        await recipeCategory.save();

        res.status(201).json({message: "Recipe created", data: newRecipe});

    }catch(err){
    console.log(err);
    }
};

exports.updateRecipe = async (req, res) => {
    try {
      const recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      if (req.user._id.toString() !== recipe.author.toString()) {
        return res.status(401).json({ message: 'Only recipe owner can update.' });
      }

      const { ingredients, cookTime, difficulty, category } = req.body;

      // Check if cookTime is a string
      if (typeof cookTime !== 'string') {
        return res.status(400).json({ message: 'Cook time must be a string.' });
      }

      let recipeCategory;

      // Check if the provided category exists
      if(category){
      const existingCategory = await Category.findOne({ name: category.toLowerCase() });

      if (existingCategory) {
          recipeCategory = existingCategory;
      } else {
          return res.status(400).json({ message: 'Please choose between these categories( breakfast, lunch, dinner, snack, dessert, others' }); 
      }  }

      // Check if ingredients name is a string and quantity is a number
      for (const ingredient of ingredients) {

        if (typeof ingredient.name !== 'string') {
          return res.status(400).json({ message: 'ingredient name must be a string.' });
        }

        if (isNaN(ingredient.quantity)) {
            return res.status(400).json({ message: 'Ingredient quantity must be a number.' });
        }

      }

      //check difficulty
      if (difficulty.toLowerCase() !== 'easy' && difficulty.toLowerCase() !== 'medium' && difficulty.toLowerCase() !== 'hard') {
          return res.status(400).json({ message: 'difficulty (easy, medium or hard).' });
      }

      const updRecipe = await Recipe.findByIdAndUpdate
      (  recipeId,
        {$set: {...req.body, category: recipeCategory._id}},   // $set MongoDB operator updates the document with specified values
        {new: true});
      
      res.status(200).json({ message: 'Recipe updated successfully', data: updRecipe});

    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid id format' });
      }
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  
  exports.deleteRecipe = async (req, res) => {
    try {
      const delrecipe = await Recipe.findById(req.params.id);
  
      if (!delrecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      if (req.user._id.toString() !== delrecipe.author.toString()) {
        return res.status(401).json({ message: 'Only recipe owner can update.' });
      }
  
      const delRecipe = await Recipe.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Recipe deleted', data: delRecipe});
    } catch (err) {
      console.error(err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid id format' });
      }
      res.status(500).json({ message: 'Internal Server Error'});
    }
  };
  

exports.recipeSearch = async(req,res) => {    //Users are able to search for recipes based on name, ingred. , cook time ....
    try{
        const query = req.query.query.trim().toLowerCase();                    //http://localhost:3000/api/recipe/search?query=chicken
                                                                                    
        let recipes = await Recipe.find({ $text: { $search: query } });                                        

        if(!recipes || recipes.length == 0){
            return res.status(404).json({message: "No recipes found."});
        }

        res.json(recipes);

    }catch(err){
        console.log(err);
    }
};


exports.rateRecipe = async (req, res) => {
  try {
    //check if recipe still available
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user has already rated the recipe
    const existingRating = recipe.ratings.find(
      rating => rating.userId.toString() === req.user._id.toString()
    );

    let {rating, feedback} = req.body;

    if(rating < 1 ){
      rating = 1;
    } 
    if(rating > 5){
      rating = 5;
    }

    if (existingRating) {
      // If user has already rated the recipe, update the rating
      existingRating.rating = rating;
      existingRating.feedback = feedback;
    } else {
      // create new rating
      recipe.ratings.push({
        userId: req.user._id,
        rating: rating,
        feedback: feedback
      });
    }

    await recipe.save();

    res.status(200).json({ message: 'Rating saved successfully', data: recipe });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}; 

exports.favorites = async (req, res) => {
  try{
    let recipeId = req.params.id;
    let userId = req.user._id;
    
    //check if recipe still available
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    } 

    // If user has already added to favorites, remove it from
  
    const user = await User.findById(userId);

    if(user.favoriteRecipes.includes(recipeId)){

      user.favoriteRecipes.pull(recipeId);

      await user.save();
      return res.status(200).json({ message: 'Recipe removed from favorites', data: user });
    }
      // Add to favorites
    user.favoriteRecipes.push(recipeId);
    
    await user.save();

    res.status(200).json({ message: 'Recipe added to favorites', data: user }); 

  }catch(error){
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id format' });
    }
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.displayFavorites = async (req, res) => {
  try{
    
    const user = await User.findById(req.user._id);

    const recipes = await Recipe.find({_id: { $in: user.favoriteRecipes }}); //$in operator to find all recipes that match the favorites of user.

    if(!recipes || recipes.length == 0){
        return res.status(404).json({message: "No recipes found, You can add recipes to your favorites and will be displayed here!"});
    }

    res.status(200).json({data: recipes});
  }catch(err){
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};