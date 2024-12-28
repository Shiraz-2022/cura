const mongoose = require('mongoose')
const Community = require('./model')
const connectDB = require('../../config/connectDb')
require('dotenv').config({ path: '../../../.env' })

const userIds = [
    "676f7ff7a10211c385b3b1f3",
    "676efe14ff28fbc2384412de",
    "676f600c206de03fa8d79e1b",
    "676f7ff7a10211c385b3b1f3"
]

const localCommunitySeeds = [
    {
        title: "Chennai Diabetes Care Network",
        subtitle: "Local support for diabetes management in Chennai",
        isGlobal: false,
        image: "https://example.com/chennai-diabetes.jpg",
        users: userIds,
        location: {
            name: "Chennai, Tamil Nadu",
            coordinates: [80.2707, 13.0827]
        }
    },
    {
        title: "Kochi Heart Care Community",
        subtitle: "Cardiac support network in Kochi",
        isGlobal: false,
        image: "https://example.com/kochi-heart.jpg",
        users: userIds,
        location: {
            name: "Kochi, Kerala",
            coordinates: [76.2673, 9.9312]
        }
    },
    {
        title: "Coimbatore Cancer Support",
        subtitle: "Local cancer care community in Coimbatore",
        isGlobal: false,
        image: "https://example.com/coimbatore-cancer.jpg",
        users: userIds,
        location: {
            name: "Coimbatore, Tamil Nadu",
            coordinates: [76.9558, 11.0168]
        }
    }
]

const seedLocalCommunities = async () => {
    try {
        await connectDB()
        await Community.deleteMany({ isGlobal: false })
        const result = await Community.insertMany(localCommunitySeeds)
        console.log(`Successfully seeded ${result.length} local communities`)
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('Error seeding local communities:', error)
        await mongoose.connection.close()
        process.exit(1)
    }
}

seedLocalCommunities()