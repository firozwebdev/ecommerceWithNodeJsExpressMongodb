var express = require('express');
var router = express.Router();


//Load models
Page = require('../models/page');

//Get Index page
router.get('/',function(req, res){
    Page.findOne({slug: 'home'}, function(err,page){
        if(err) console.log(err);
        
        res.render('index',{
            title: page.title,
            content: page.content
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