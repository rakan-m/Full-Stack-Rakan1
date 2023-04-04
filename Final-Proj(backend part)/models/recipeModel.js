const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new mongoose.Schema ({

    title: {   //recipe Name
        type: String,
        required: true,
        trim: true
    },

    author: {    //User who added this recipe  
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      
    description: {
        type: String,
        required: true
    },
 
    ingredients: [       // { name: 'pasta', quantity: 1 },{ name: 'garlic', quantity: 4 },...
        {
            name: {   
            type:String,
            required:true
        },
            quantity: {
            type:Number,
            required:true
        }
      }],

    instructions: {      // ['Cook the pasta','Add the garlic and cook for 1 minute',...]
        type: [String],
        required: true
    },

    cookTime: {        //example: "1 hour and 30 minutes"
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },

    recImage: {       //image of a completed recipe
        type: String
    },   
    
    videoTutorial: {   //Recipe videos could be included, providing users with step-by-step instructions
        type: String
    },

    category:[   
    {
        type: Schema.Types.ObjectId,
        ref:'Category',
        required: true
    }],

    ratings: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
          },
          feedback: {
            type: String
          }
        }
    ]
},

{ timestamps:true });

recipeSchema.index({ title: "text", ingredients: "text", description: "text", cookTime:"text" });

module.exports = mongoose.model('Recipe',recipeSchema);