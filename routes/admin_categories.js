var express = require('express');
var router = express.Router();

//Get Category model
var Category = require('../models/category');

// Get categories index
router.get('/',function(req, res){
  
   Category.find(function(err, categories){
       if(err) return console.log(err);
        res.render('admin/categories',{
            title: 'Categories',
            categories: categories
        });
   });
        
    
   
});

//Get add category
router.get('/add-category',function(req, res){
   var title = "";
   
   res.render('admin/add_category',{
       title: title,
       
   });
});

//Post add category
router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();
    

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
   
    var errors = req.validationErrors();
   
    if (errors) {
        console.log('errors');
        res.render('admin/add_category', {
            errors: errors,
            title: title,
            
        });
    } else {
        Category.findOne({slug: slug},function(err, category){
            if(category){
                req.flash('danger','Category title exists, choose another');
                res.render('admin/add_category',{
                    title: title,
                });
            }else{
                var category = new Category({
                    title: title,
                    slug: slug,
                });
                category.save(function(err){
                    if(err) return console.log(err);
                    req.flash('success','Category added');
                    res.redirect('/admin/categories');
                });
            }
        });
    }

 
});




//Get edit category
router.get('/edit-category/:id',function(req, res){
   
    Category.findById(req.params.id, function(err, category){
        if(err) return console.log(err);
        res.render('admin/edit_category',{
            title: category.title,
            id : category._id
        });
    });
 
   
 });

 //Post edit category
 router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    
    var id = req.body.id;

    var errors = req.validationErrors();
   
    if (errors) {
        console.log('errors');
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
        });
    } else {
        Category.findOne({slug: slug, _id:{ $ne: id}},function(err, category){
            if(category){
                req.flash('danger','Category title exists, choose another');
                res.render('admin/edit_category',{
                    title: title,
                    id:id
                });
            }else{
                Category.findById(id,function(err,category){
                    if(err) return console.log(err);
                    category.title = title;
                    category.slug = slug;
                    category.save(function(err){
                        if(err) return console.log(err);
                        req.flash('success','Category Edited');
                        res.redirect('/admin/categories/edit-category/'+ id);
                    });
               });
               
            }
        });
    }

 
});

// Get delete category
router.get('/delete-category/:id',function(req, res){
   Category.findByIdAndRemove(req.params.id,function(err){
       if(err) return console.log(err);
       req.flash('success','Category Deleted');
       res.redirect('/admin/categories/');
   });
   
});
//Exports
module.exports = router;