const { Router } = require('express');
const authController = require('../Controllers/authController')
const router = Router();
const { checkUser,requireAuth } = require('../middleware/authMiddleware')

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)
router.post('/create', authController.update_recipe);
router.delete("/smoothies/:userId/:recipeId", authController.recipe_delete);

module.exports = router;