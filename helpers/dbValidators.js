const { Category, Rol, Product, User } = require('../models')

const isEmailRegistered = async (email = '') => {
    const existEmail = await User.findOne({ email })

    if (existEmail) throw new Error(`email ${email} already registered`)
}

const isValidRol = async (rol) => {
    if (rol) {
        const exist = await Rol.findOne({ rol })
    
        if (!exist) throw new Error(`rol ${rol} not allowed`)
    }
}

const isValidUserId = async (id = '') => {
    const exist = await User.findById({ id })

    if (!exist) throw new Error(`id ${id} not exists`)
}

const isValidCategoryId = async(id = '') => {
    try {
        const exist = await Category.findById(id)

        if (!exist) throw new Error(`id ${id} not exists`)
    } catch (error) {
        throw new Error(error)
    }
}

const isValidProductId = async(id = '') => {
    try {
        const exist = await Product.findById(id)

        if (!exist) throw new Error(`id ${id} not exists`)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    isEmailRegistered,
    isValidCategoryId,
    isValidRol,
    isValidProductId,
    isValidUserId
}