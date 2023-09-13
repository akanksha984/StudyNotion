const Category= require('../models/Category');

exports.createCategory= async(req,res)=>{
    try{
        // get the data
        const {title,description}= req.body;
        // validate
        if (!title || !description){
            return res.json({
                success: false,
                message: "Please fill all the details"
            });
        }
        // create entry in the db
        await Category.create({name:title,description:description});
        //return res
        return res.status(200).json({
            success: true,
            message: "Category created succcessfully",
        });
    }catch(error){
        console.log("Error in category creation");
        return res.json({
            success: false,
            message: "Error in category creation",
            error: error.message,
        })
    }
}

exports.showAllCategories= async(req,res)=>{
    try{
        const allCategories= await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success: true,
            message: "All Categories fetched",
            data: allCategories,
        })

    }catch(error){
        console.log("Error in fetching all the Categories");
        return res.json({
            success: false,
            message: "Error in Category creation",
            error: error.messge,
        })
    }
}

function getRandomInt(max){
    return Math.floor(Math.random()*max);
}
// category page details
exports.categoryPageDetails = async(req,res)=>{
    try{
        // get the category id
        const {categoryId}= req.body;
        //console.log("got id->",categoryId);
        // get all the courses associated to the category
        const selectedCategory= await Category.findById({_id:categoryId})
                                                .populate({
                                                    path:"course",
                                                    match: {status: "Published"},
                                                    populate: "ratingAndReviews",
                                                })
                                                .exec();
        //validate
        if (!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "No data found",
            });
        }
        //console.log("cate",selectedCategory);
        if (selectedCategory.course.length === 0){
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category",
            })
        }

        // get courses for different categories
        const categoriesExceptSelected= await Category.find({
            _id: {$ne:categoryId},  // not equal to categoryId
        }).populate("course").exec();
        let differentCategory= await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        ).populate({
            path: "course",
            match: {status: "Published"}
        })
        // get top selling courses
        const allCategories= await Category.find()
                                    .populate({
                                        path: "course",
                                        match: {status:"Published"},
                                        populate:{
                                            path: "instructor",
                                        }
                                    }).exec();
        const allCourses= allCategories.flatMap((category)=>category.course);
        //console.log("all courses here" , allCourses)
        const mostSellingCourses= allCourses.sort((a,b)=>b.sold-a.sold)
                                            .slice(0,10);

        // return res
        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
                /* allCategories,
                allCourses */
            }
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in fetching categoryPageDetails",
            error: error.message,
        })
    }
}

