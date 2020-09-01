const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require("path")
// get() is for heroku
const config = require('./config/config').get(process.env.NODE_ENV);
const app = express();


// file upload
const cors = require('cors');
const multer = require('multer');
const fs = require('fs')




// connect to mongo
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

// bring in mongo model
const { User } = require('./models/user');
// const { Book } = require('./models/book');
const { Item } = require('./models/item');
const { Collection } = require('./models/collection');
const { Cat } = require('./models/cat');
const { SubCat } = require('./models/subcat');
const { Intro } = require('./models/intro');
const { Info } = require('./models/info');



const { auth } = require('./middleware/auth');
const { fileURLToPath } = require('url');


// set middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())



// FOR HEROKU
// DIRECT TO BUILD FOLDER !!
// static is css and js
app.use(express.static('client/build'))



// *************************************************************
// **************************** GET ****************************
// *************************************************************



// deny access
app.get('/api/auth', auth, (req, res) => {
    res.json({
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
})



// check if user is logged in, auth is middleware
app.get('/api/logout', auth, (req, res) => {
    //delete user's cookie info in the db
    req.user.deleteToken(req.token, (err, user) => {
        if(err) return res.status(400).send(err);
        res.sendStatus(200)
    })

}) 




// * * * * * * * * * * * * * * * * * * * * getItemById
app.get('/api/getItemById', (req,res) => {
    let id = req.query.id;
    Item.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * searchItem
app.get('/api/searchItem', (req,res) => {
    let queryKey = req.query.key;
    let queryValue = req.query.value;

    var query = {};
    query[queryKey] = queryValue;

    Item.find( query , (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



// * * * * * * * * * * * * * * * * * * * * get all items TEST
app.get('/api/allItems', (req, res) => {
    // empty object returns all
    Item.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})







// * * * * * * * * * * * * * * * * * * * * get multiple items
app.get('/api/items', (req,res) => {
    // query should look like this: localhost:3001/api/items?skip=3?limit=2&order=asc
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;

    // order  = asc || desc
    Item.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})







// get reviewer by id  -- NOT USED 
app.get('/api/getReviewer', (req, res) => {
    let id = req.query.id;

    User.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            name:doc.name,
            lastname:doc.lastname
        })
    })
})


// * * * * * * * * * * * * * * * * * * * * get contributor by id
app.get('/api/getContributor', (req, res) => {
    let id = req.query.id;

    User.findById(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            name:doc.name,
            lastname:doc.lastname
        })
    })
})


// get users
app.get('/api/users', (req, res) => {
    // empty object returns all
    User.find({}, (err, users) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(users);
    })
})


app.get('/api/user_posts', (req, res) => {
    Book.find({ownerId:req.query.user}).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})

app.get('/api/user_items', (req, res) => {
    Item.find({ownerId:req.query.user}).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})



// * * * * * * * * * * * * * * * * * * * * get all collections

app.get('/api/collections', (req, res) => {
    Collection.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})



// * * * * * * * * * * * * * * * * * * * * get collection by id


app.get('/api/getCollById', (req,res) => {
    let idQuery = req.query.id;
    Collection.find({id: idQuery}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * get all categories

app.get('/api/categories', (req, res) => {
    Cat.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})



// * * * * * * * * * * * * * * * * * * * * get all sub-categories

app.get('/api/subcategories', (req, res) => {
    SubCat.find({}, (err, items) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(items);
    })
})


// * * * * * * * * * * * * * * * * * * * * get item by collection


app.get('/api/getItemByColl', (req, res) => {

    let value = req.query.value;
  
    Item.find({ collection_id:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})


// * * * * * * * * * * * * * * * * * * * * get item by category


app.get('/api/getItemsByCat', (req, res) => {

    let value = req.query.value;
    console.log(value);
  
    Item.find({ category_ref:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})



// * * * * * * * * * * * * * * * * * * * * getNextItem
app.get('/api/getNextItem', (req,res) => {
    let oldId = req.query.oldId;
    let query = {_id: {$gt: oldId}}
    Item.findOne(query, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * getPrevItem
app.get('/api/getPrevItem', (req,res) => {
    let oldId = req.query.oldId;
    // let query = {_id: {$lt: oldId}}, null, { sort: { '_id':-1 } };
    Item.findOne({_id: {$lt: oldId}}, null, { sort: { '_id':-1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * get latest item
app.get('/api/getLatestItem', (req,res) => {

    Item.findOne({}, {}, { sort: { '_id':-1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



// * * * * * * * * * * * * * * * * * * * * get subcat info
app.get('/api/getSubcat', (req,res) => {
    let subcatId = req.query.subcatid;

    SubCat.findOne({ _id: subcatId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * get items by subcat
app.get('/api/getItemsBySubcat', (req,res) => {
    let subcatId = req.query.subcatid;

    Item.find({ subcategory_ref: subcatId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



// not used
// * * * * * * * * * * * * * * * * * * * * get first item by subcat and cat
app.get('/api/getFirstItemBySubcat', (req,res) => {
    let catId = req.query.catid;
    let subcatId = req.query.subcatid;

    Item.findOne({category_ref: catId, subcategory_ref: subcatId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})

// * * * * * * * * * * * * * * * * * * * * get subcats by cat
app.get('/api/getSubcatByCat', (req,res) => {
    let catId = req.query.catid;

    SubCat.find({ parent_cat: catId}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


// * * * * * * * * * * * * * * * * * * * * GET CAT / SUBCAT / COLL BY ID!


app.get('/api/getCatById', (req, res) => {
    let value = req.query.id;
  
    Cat.findOne({ _id:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})


app.get('/api/getSubcatById', (req, res) => {
    let value = req.query.id;
  
    SubCat.find({ _id:value }).exec( (err, docs) => {
        if(err) return res.status(400).send(err);
        res.send(docs);
    })
})

// ******************** get intro text

app.get('/api/getIntroText', (req,res) => {

    Intro.findOne({}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})


//  ******************** get info text

app.get('/api/getInfoText', (req,res) => {
    console.log('get info text called')
    Info.findOne({}, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})



//  ******************** get documents with coordinates

app.get('/api/getItemsWithCoords', (req,res) => {
    // console.log('getItemsWithCoords called')
    Item.find( { "geo.latitude": {$ne:null} }, {}, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})





// *******************************************************
// ********************* POST ****************************
// *******************************************************



// * * * * * * * * * * * * * * * * * * * * post new item
app.post('/api/item', (req, res) => {
    const item = new Item( req.body );             // req is the data you post

    item.save( (err, doc) =>{                      // saves the new document
        // console.log(doc._id);
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            itemId:doc._id                       // gets the id from the post
        })
      })
})


// register user
app.post('/api/register', (req, res) => {
    // create new user document (user)
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({success:false});
        res.status(200).json({
            success:true,
            user:doc
        })
    })
})


// create the login
app.post('/api/login', (req, res) => {
    // look through the whole database
    User.findOne({'email':req.body.email}, (err, user) => {
        // console.log(user);

        if(!user) return res.json({isAuth:false, message:'Auth failed, email not found'});

        user.comparePassword(req.body.password, (err, isMatch) => {
            // console.log(user);

            if(!isMatch) return res.json({
                isAuth:false,
                message:'Wrong password'
            });
            // generate token
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                res.cookie('auth', user.token).send({
                    isAuth:true,
                    id:user._id,
                    email:user.email
                });
            });
        });
    });
});


// * * * * * * * * * * * * * * * * * * * * post new category
app.post('/api/add-cat', (req, res) => {
    const cat = new Cat( req.body );             // req is the data you post

    cat.save( (err, doc) =>{                      // saves the new document
        // console.log(doc._id);
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            catId:doc._id                       // gets the id from the post
        })
      })
})



// * * * * * * * * * * * * * * * * * * * * post new subcategory
app.post('/api/add-subcat', (req, res) => {
    const subcat = new SubCat( req.body );             // req is the data you post

    subcat.save( (err, doc) =>{                      // saves the new document
        // console.log(doc._id);
        if(err) return res.status(400).send(doc);
        res.status(200).json({
            post:true,
            catId:doc._id                       // gets the id from the post
        })
      })
})



// ****************************************************************
// **************************** UPDATE ****************************
// ****************************************************************








// * * * * * * * * * * * * * * * * * * * * update item
app.post('/api/item_update', (req, res) => {
    // new:true allows upsert
    Item.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})



// * * * * * * * * * * * * * * * * * * * * update cat
app.post('/api/cat-update', (req, res) => {
    // new:true allows upsert
    Cat.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})


// * * * * * * * * * * * * * * * * * * * * update subcat
app.post('/api/subcat-update', (req, res) => {
    // new:true allows upsert
    SubCat.findByIdAndUpdate(req.body._id, req.body, {new:true}, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})



// * * * * * * * * * * * * * * * * * * * * update intro text
app.post('/api/update-intro-text', (req, res) => {
    // new:true allows upsert

    // console.log(req.body);

    Intro.findOneAndUpdate({}, req.body, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})


// * * * * * * * * * * * * * * * * * * * * update info text
app.post('/api/update-info-text', (req, res) => {
    // new:true allows upsert

    // console.log(req.body);

    Info.findOneAndUpdate({}, req.body, { sort: { '_id':1 } }, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        });
    })
})




// ****************************************************************
//  **************************** DELETE ***************************
// ****************************************************************




// * * * * * * * * * * * * * * * * * * * *  delete item
app.delete('/api/delete_item', (req, res) => {
    let id = req.query.id;

    Item.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})


// * * * * * * * * * * * * * * * * * * * *  delete cat
app.delete('/api/delete-cat', (req, res) => {
    let id = req.query.id;

    Cat.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})


// * * * * * * * * * * * * * * * * * * * *  delete subcat
app.delete('/api/delete-subcat', (req, res) => {
    let id = req.query.id;

    SubCat.findByIdAndRemove(id, (err, doc) => {
        if(err) return res.status(400).send(err);
        res.json(true);
    })
})



//  ************ FILE STUFF !!! ********************************************


//create multer instance, for file saving
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/media/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
  }
})

// var upload = multer({ storage: storage }).single('file');
let upload = multer({ storage: storage }).array('file')




// post file
app.post('/upload', function(req, res) {
        // console.log(req);
     
        upload(req, res, function (err) {
              if (err instanceof multer.MulterError) {
                  return res.status(500).json(err)
              } else if (err) {
                  return res.status(500).json(err)
              }
        return res.status(200).send(req.file)
    })
});



// delete file
app.post('/delete-file', function(req, res) {
    let query = '../client/public/media';


    const getSubfoldersInFolder = (dir) => {
        let folders = [];
        fs.readdir(dir, {withFileTypes: true}, (err, files) => {
            files.map( file => {
                let string = path.resolve(dir, file.name)
                if (fs.lstatSync(string).isDirectory()) {
                    folders.push(string)
                
                }
            
            })
        });
        return folders;
    }



    console.log(getSubfoldersInFolder(query))

    // const deleteFilesInFolder = (dir) => {
    //     fs.readdir(dir, {withFileTypes: true}, (err, files) => {
    //         files.map( file => {
    //             let string = path.resolve(dir, file.name);
    //             if (fs.lstatSync(string).isFile()) {
    //                 fs.unlinkSync(string, function (err) {
    //                     if (err) throw err;
    //                     console.log('File deleted!' + file.name);
    //                 });
    //             }

    //         })
    //     })

    // }

    if (req.body.deleteAll && req.body.id) {

        let url = path.resolve(query, 'items', req.body.id)
        // path.resolve(query, 'items', req.body.id)

        // console.log(url)



        // deleteFilesInFolder(url + '/fullsize');
        // deleteFilesInFolder(url + '/original');
        // deleteFilesInFolder(url + '/sq_thumbnail');
        // deleteFilesInFolder(url + '/thumbnail');

        

    } 
    // else {

    //     if (req.body.section) {
    //         query += `/${req.body.section}`;
    //     }
    //     if (req.body.id) {
    //         query += `/${req.body.id}`;
    //     }
    //     if (req.body.fileName) {
    //         query += `/${req.body.fileName}`;
    //     }

    //     // fs.unlink(query, function (err) {
    //     //     if (err) throw err;
    //     //     console.log('File deleted!');
    //     // })
    // }
});



// remove directory recursively
app.post('/delete-dir', function(req, res) {
    const baseUrl = '../client/public/media';

    let section = req.body.section;
    let id = req.body.id;

    let dir = path.resolve(baseUrl, section, id)


    console.log(dir);

    const deleteDir = (dir, subDir) => {
        fs.rmdir(subDir, () => {
            console.log('Deleted: ' + subDir);
            fs.rmdir(dir, () => {
                console.log('Deleted: ' + dir);
            })
        })
    }

    if (dir != baseUrl) {
        fs.readdir(dir, {withFileTypes: true}, (err, files) => {
            if (files && files.length) {
                files.forEach( file => {
                    let string = path.resolve(dir, file.name)
                    // console.log(string);
                    if (fs.lstatSync(string).isFile()) {
                        fs.unlink(string, function (err) {
                            if (err) throw err;
                            console.log('File deleted!' + file.name);
                        })
                    }

                    if (fs.lstatSync(string).isDirectory()) {
                        let subDir = path.resolve(dir, file.name)
                        console.log(subDir);

                        fs.readdir(subDir, {withFileTypes: true}, (err, files) => {
                            files.forEach( file => {
                                let subFile = path.resolve(string, file.name)
                                if (fs.lstatSync(subFile).isFile()) {
                                    fs.unlink(subFile, function (err) {
                                        if (err) throw err;
                                        console.log('File deleted!' + file.name);
                
                                        deleteDir(dir, subDir);

                                        

                                    })
                                }
                            })
                        })
                    }
                })
            }
        })
    }
    return res.status(200)
})




// get number of files
app.post('/get-number-files', function(req, res) {
    const baseUrl = '../client/public/media';

    let section = req.body.section;
    let id = req.body.id;
    let fileType = req.body.filetype;

    let dir = path.resolve(baseUrl, section, id, fileType)

    let numFiles = 0;

    console.log(dir);




    if (dir != baseUrl) {
        fs.readdir(dir, {withFileTypes: true}, (err, files) => {
            if (files && files.length) {
                files.forEach( file => {
                    numFiles++
                })
            }
        })
    }
    return res.status(200)
})





//  ******************* FOR HEROKU *************************************
// if the server doesn't find the route, fall back to home dir
if(process.env.NODE_ENV === 'production') {
    const path = require('path');

    app.get('/*', () => {
        // mian root of directory
        // find in /client/build/index.html 
        res.sendfile(path.resolve(__dirname), '../client', 'build', 'index.html')
    })
}


//  ********************************************************



// run express app
const port = process.env.PORT || 3001;


// console.log(process.env);

app.listen(port, () => {
    console.log(`SERVER RUNNING : port ${port}`)
})