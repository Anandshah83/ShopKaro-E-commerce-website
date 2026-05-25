const express=require('express');
const { fetchAllUsers, fetchUsersById, createNewUser, updateUser, deleteUser} = require('../controllers/user.controller');
const router=express.Router();

router.get('/',fetchAllUsers);
router.get('/:id',fetchUsersById);
router.post('/',createNewUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

module.exports=router;

