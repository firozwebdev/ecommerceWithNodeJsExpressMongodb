var express = require('express');
var router = express.Router();


//Load models
Category = require('../models/category');
Product = require('../models/product');

//Get Index page
router.get('/',function(req, res){
    Product.find(function(err,products){
        if(err) console.log(err);
        
        res.render('all_products',{
            title: 'All Products',
            products: products
        });
        
    });
});

//get products by category
router.get('/:category',function(req,res){
    var categorySlug = req.params.category;
    Category.findOne({slug: categorySlug}, function(err,category){

        Product.find({category: categorySlug},function(err,products){
            if(err) console.log(err);
            res.render('category_products',{
                title: category.title,
                products: products
            });
        });
    });
   
});


//Exports
module.exports = router;