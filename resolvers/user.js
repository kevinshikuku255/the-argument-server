const dotenv = require( 'dotenv');
const { UserInputError } = require('apollo-server-errors');
const  generateToken  = require( '../utils/generate-token');
const {  upLoadResponse } = require('../utils/cloudinary');


dotenv.config();

const Query = {

/**
 * Get auth user
 */
getAuthUser: async(_, __,   {authUser, User}) => {
    if (authUser) {
    }
    const query = { _id: authUser.id};
    const user = await User.findById(query)
      .populate({
        path: "messages",
        populate: [
          { path: "sender" },
          { path: "receiver" }
        ]
      })

 //Return auth user
 return user
},


/** Find all groups */
getGroups: async(_, __, {User}) => {
        const query = { group: true};
        const group = User.find(query)
      .populate({
        path: "messages",
        populate: [
          { path: "sender" },
          { path: "receiver" }
        ]
      })
 //Return auth user
 return group
},

/**
 *  Get all users except logedIn user
 */
getUsers: async(_, __, { User, authUser } ) => {
   try{
         // Find users that user is not following
      const users =  await User.find({_id: {$ne: authUser.id}})
        .populate({
          path: "messages",
          populate: [
            { path: "sender" },
            { path: "receiver" }
          ]
        })
         .sort({ createdAt: 'desc' });
     // return list of users
      return users
   }catch(err){
     throw new Error(err)
   }
},



  /**
   * Gets user by username
   *
   * @param {string} id
   */
  getUser: async (_, {  username }, { User }) => {
    if (!username) {
      throw new UserInputError('useId is required params.');
    }
    const query = { username};
    const user = await User.findOne(query)
      .populate({
        path: 'messages', populate: [
          { path: 'sender' },
          { path: 'receiver' }
        ],
        options: { sort: { createdAt: 'desc' } },
      })

    if (!user) {
      throw new UserInputError("User with given Details doesn't exists.");
    }

    return user;
  },
}










const Mutation = {
  /**
   * Signs up  new user only accesible by application admin
   * @param {string} username
   */
  signup:    async (  _,  {
        username ,
        group,
        description,
        stadium,
        founded,
         founder,
        owner,
        manager,
        image,
        coverImage,
    },
    { User }) => {
    //error object
    let errors = { }

   // wrap this in a try catch block
  // Check if user with given  username already exists
    try{
            const user = await User.findOne().or([{ username }]);
            //check if uuser exists
            if (user) {
              errors.user  =  `${username} is taken`
            }

          //fields validation
            if ( !username ) {
               errors.username  =  "invalid username";
            }

            //throw the error object
            if(Object.keys(errors).length > 0) throw  errors;

            //image upload logic
              let imageUrl
              if (image) {
                  const imageResults = await upLoadResponse(image)
                  imageUrl = imageResults.secure_url;
              }

            //Cover image upload logic
              let coverImageUrl
              if (coverImage) {
                  const imageResults = await upLoadResponse(image)
                  covermageUrl = imageResults.secure_url;
              }


            // save the user to DB
            const newUser = await new User({
                username,
                description,
                group,
                founded,
                founder,
                owner,
                manager,
                stadium,
                image: imageUrl,
                coverImage: coverImageUrl

              }).save();

          // Generate user token
         const    token = generateToken(newUser, process.env.JWT_SECRET, process.env.AUTH_TOKEN_EXPIRY);
         newUser.token = token;


         //Return user
          return newUser;
    }catch(err){
           throw new UserInputError(`Bad input `, {errors: err})
    }
  },




/* -------------------------------------------------------------------------- */
  /**
   * Signs in user existing user
   * @param {string} username
   */
  signin:     async (_, { username }, { User }) => {
  //errror object
  let errors = { };
  try{
          const user = await User.findOne().or([ { username } ]);
         //chack if user exists
          if (!user) { errors.user  =  "user doesnt exist" }

          // user input validation
          if (!username) {    errors.username  =  "invalid username" }

          //throw the error object
          if(Object.keys(errors).length > 0) throw  errors;

          // Generate user token
         const    token = generateToken(user, JWT_SECRET, AUTH_TOKEN_EXPIRY);
         user.token = token

         //Return user
          return user;

  }catch(err){

         throw new UserInputError(`Bad input `, {errors: err})
    }
  },
}

module.exports = {Query, Mutation}