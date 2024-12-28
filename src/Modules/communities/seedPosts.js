const mongoose = require('mongoose')
const Post = require('./postModel')
const Community = require('./model')
const connectDB = require('../../config/connectDb')
require('dotenv').config({ path: '../../../.env' })

const userIds = [
    "676f7ff7a10211c385b3b1f3",
    "676efe14ff28fbc2384412de",
    "676f600c206de03fa8d79e1b",
    "676f7ff7a10211c385b3b1f3"
]

let threadCounter = 1

const generateSubThreads = () => {
    const responses = [
        "This is exactly what I needed to know",
        "I'll definitely try this approach",
        "Thanks for sharing your experience",
        "That's really helpful to know",
        "Makes perfect sense now"
    ]

    return responses.slice(0, Math.floor(Math.random() * 3)).map(comment => ({
        id: threadCounter++,
        Name: "User " + Math.floor(Math.random() * 100),
        comment,
        upvotes: Math.floor(Math.random() * 1000) + "k",
        time: Math.floor(Math.random() * 24) + "hrs",
        subThreads: []
    }))
}

const generateThreads = (type) => {
    const discussions = {
        diabetes: [
            "Been managing this for 5 years now. Happy to share what worked for me",
            "The morning walks really help. Anyone interested in joining?",
            "I found some good sugar-free sweets, will share the shop details"
        ],
        heart: [
            "Started small lifestyle changes, making good progress",
            "Anyone else following the new Mediterranean diet plan?",
            "The breathing exercises have been really helpful"
        ],
        cancer: [
            "Taking one day at a time, staying positive",
            "The meditation sessions are really helping",
            "Anyone else trying the new dietary changes?"
        ]
    }

    return discussions[type].map(comment => ({
        id: threadCounter++,
        Name: "User " + Math.floor(Math.random() * 100),
        comment,
        upvotes: Math.floor(Math.random() * 10000) + "k",
        time: Math.floor(Math.random() * 24) + "hrs",
        subThreads: generateSubThreads()
    }))
}

const seedPosts = async () => {
    try {
        await connectDB()
        const communities = await Community.find()
        await Post.deleteMany({})

        const posts = [
            {
                title: "Starting My Journey",
                subtitle: "Recently diagnosed and looking for support",
                image: "https://picsum.photos/800/400?random=1",
                community: communities[0]._id,
                user: userIds[0],
                likes: [userIds[1]],
                threads: generateThreads('diabetes')
            },
            {
                title: "Daily Routine Discussion",
                subtitle: "What works for everyone?",
                image: "https://picsum.photos/800/400?random=2",
                community: communities[0]._id,
                user: userIds[1],
                likes: [userIds[0]],
                threads: generateThreads('diabetes')
            },
            {
                title: "Lifestyle Changes",
                subtitle: "Small steps, big impact",
                image: "https://picsum.photos/800/400?random=3",
                community: communities[1]._id,
                user: userIds[2],
                likes: [userIds[3]],
                threads: generateThreads('heart')
            },
            {
                title: "Stress Management Tips",
                subtitle: "What helps you stay calm?",
                image: "https://picsum.photos/800/400?random=4",
                community: communities[1]._id,
                user: userIds[3],
                likes: [userIds[0]],
                threads: generateThreads('heart')
            }
        ]

        const result = await Post.insertMany(posts)
        console.log(`Successfully seeded ${result.length} posts`)
        await mongoose.connection.close()
        process.exit(0)
    } catch (error) {
        console.error('Error seeding posts:', error)
        await mongoose.connection.close()
        process.exit(1)
    }
}

seedPosts()