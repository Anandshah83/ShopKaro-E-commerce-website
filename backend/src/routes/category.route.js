
const express=require('express');

const { fetchAllCategory, fetchCategoryById, createNewCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const router=express.Router();

router.get('/',fetchAllCategory);
router.get('/:id',fetchCategoryById);
router.post('/',createNewCategory);
router.put('/:id',updateCategory);
router.delete('/:id', deleteCategory);

module.exports=router;