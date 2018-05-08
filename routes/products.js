var express = require('express');
var router = express.Router();
var fs = require('fs-extra');


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

//get products details
router.get('/:category/:product',function(req,res){
    
   var galleryImages = null;
   Product.findOne({slug: req.params.product}, function(err,product){
       if(err){
           console.log(err);
       }else{
           var galleryDir = 'public/product_images/'+ product.id +'/gallery';
           fs.readdir(galleryDir,function(err,files){
               if(err){
                   console.log(err);
               }else{
                   galleryImages = files;
                   res.render('product',{
                       title:product.title,
                       product: product,
                       galleryImages: galleryImages
                   });
               }
           });
       }
   });
   
});


//Exports
module.exports = router;