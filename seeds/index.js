const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(()=>{
    console.log('Connection open with MONGO DB');
})
.catch((e)=>{
    console.log(e);
})

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20)+10;
      const camp =  new Campground({
            author:'660f9ab90ce3d1d11894e13f',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dglsfk8mr/image/upload/v1713356023/Yelpcamp/lzxcda8gnzuocmlovdu6.jpg',
                  filename: 'Yelpcamp/e9uosi7iukk61akvou0y'
                },
                {
                  url: 'https://res.cloudinary.com/dglsfk8mr/image/upload/v1713346240/Yelpcamp/p9bktxy7ix75hlugf6qr.jpg',
                  filename: 'Yelpcamp/p9bktxy7ix75hlugf6qr'
                }
              ],
            price: price,
            description:' Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores voluptatem, quidem quaerat reprehenderit quod quae dolor neque facilis tempore voluptate odio numquam magnam reiciendis rerum laborum aliquid doloremque autem. Soluta!'

        })
        await camp.save();
    }
}

seedDB()
.then(()=>{
    mongoose.connection.close();
})