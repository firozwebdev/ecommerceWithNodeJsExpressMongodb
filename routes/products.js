var express = require('express');
var router = express.Router();


//Load models
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

//get a page
router.get('/:slug',function(req,res){
    var slug = req.params.slug;
    Page.findOne({slug: slug}, function(err,page){
        if(err) console.log(err);
        if(!page){
            res.redirect('/');
        }else{
            res.render('index',{
                title: page.title,
                content: page.content
            });
        }
    });
    
});

//Exports
module.exports = router;