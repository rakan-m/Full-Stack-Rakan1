const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

exports.createCategory = async(req,res) => {
    try{

      // Check if user is logged in and is an admin
      const user = await User.findById(req.user._id);
    
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized, Not admin' });
      }
      const { name, description, recipes} = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Name is required." });
      } 

      //check if category exist or not
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
      
      // Check if cookTime is a string
      if ( typeof name !== 'string' || typeof description !== 'string' ) {
        return res.status(400).json({ message: 'name and description must be a string.' }); 
      }

      const newCategory = await Category.create({
          name: name.toLowerCase(),
          description,
          recipes
      });
        
      res.status(201).json({message: "Category created", data: newCategory});
  } catch(err){
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
};

//display recipes by category

exports.recipesByCategory = async (req, res) => {
    try {
      const categoryName = req.params.categoryName;

      //check if category exist
      const existingCategory = await Category.findOne({ name: categoryName });

      if(!existingCategory){
        return res.status(404).json({ message: 'Category not found' });
      }

      const category = await existingCategory.populate('recipes');
      
      if (!category || category.recipes.length === 0) {
        return res.status(404).json({ message: 'No Recipes found' });
      }
  
      res.json(category.recipes);
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
};


exports.updateCategory = async (req, res) => {
    try {

      // Check if user is logged in and is an admin
      const user = await User.findById(req.user._id);
    
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized, Not admin' });
      }
      
      const categoryName = req.params.categoryName;

      const updCategory = await Category.findOneAndUpdate
      ({ name: categoryName },
        {$set: req.body},     
        {new: true});
  
      if (!updCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.status(200).json({ message: 'Category updated successfully', data: updCategory});
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

  
exports.deleteCategory = async (req, res) => {
    try {

      // Check if user is logged in and is an admin
      const user = await User.findById(req.user._id);
    
      if (!user || !user.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized, not admin' });
      }

      const categoryName = req.params.categoryName;

      const delCategory = await Category.findOneAndDelete({ name: categoryName });

      if (!delCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ message: 'Category deleted', data: delCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};