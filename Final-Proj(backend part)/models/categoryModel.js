const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema ({

    name: {  
        type:String,
        enum:['breakfast', 'lunch', 'dinner', 'snack', 'dessert','others'],
        required:true,
        trim:true
    },

    description: {
        type:String,
    },

    recipes: [ 
        {
            type:Schema.Types.ObjectId,
            ref:'Recipe'
        },
    ],
},

{ timestamps:true });

categorySchema.index({ name: "text", description: "text" });

module.exports = mongoose.model('Category',categorySchema);