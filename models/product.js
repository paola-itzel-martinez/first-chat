const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    required: [true, 'status is required'],
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String
  },
  availability: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'category is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  img: {
    type: String
  }
})

ProductSchema.methods.toJSON = function() {
  const { __v, _id, ...product } = this.toObject()

  product.uid = _id
  
  return product
}

module.exports = model('Product', ProductSchema)
