const mongoose = require('mongoose')
const Message = require('./model')
require('dotenv').config()

const seedDatabase = async () => {
    const messages = [
        {
            sender: "Yadu",
            message: "Hi Shiraz, I was recently diagnosed with Type 2 Diabetes. Been feeling overwhelmed with all the lifestyle changes.",
            timestamp: new Date("2024-03-20T09:00:00"),
            isReceived: false
        },
        {
            sender: "Shiraz",
            message: "Hello Yadu! I understand how you feel. I've been managing T2D for 5 years now. What specific challenges are you facing?",
            timestamp: new Date("2024-03-20T09:02:00"),
            isReceived: true
        },
        {
            sender: "Yadu",
            message: "Thanks for responding! Mainly struggling with meal planning and glucose monitoring. How do you handle daily testing?",
            timestamp: new Date("2024-03-20T09:05:00"),
            isReceived: false
        },
        {
            sender: "Shiraz",
            message: "I use a CGM device - it's been a game changer. For meals, I follow a simple plate method: half vegetables, quarter protein, quarter whole grains.",
            timestamp: new Date("2024-03-20T09:07:00"),
            isReceived: true
        },
        {
            sender: "Yadu",
            message: "CGM sounds interesting. Did your insurance cover it? Also, do you use any apps to track your meals?",
            timestamp: new Date("2024-03-20T09:10:00"),
            isReceived: false
        },
        {
            sender: "Shiraz",
            message: "Yes, insurance covered it after my doctor's recommendation. I use MyFitnessPal for meal tracking - helps me understand carb intake better.",
            timestamp: new Date("2024-03-20T09:12:00"),
            isReceived: true
        },
        {
            sender: "Yadu",
            message: "That's helpful! Do you participate in any local support groups? I feel like connecting with others might help.",
            timestamp: new Date("2024-03-20T09:15:00"),
            isReceived: false
        },
        {
            sender: "Shiraz",
            message: "Actually, there's a great group that meets every Tuesday at the Community Health Center. Would you like to join next week?",
            timestamp: new Date("2024-03-20T09:17:00"),
            isReceived: true
        },
        {
            sender: "Yadu",
            message: "That would be fantastic! Could you share the address and time?",
            timestamp: new Date("2024-03-20T09:20:00"),
            isReceived: false
        },
        {
            sender: "Shiraz",
            message: "It's at 123 Health Street, 6 PM. They also have a nutritionist who gives great practical advice. I'll introduce you to everyone!",
            timestamp: new Date("2024-03-20T09:22:00"),
            isReceived: true
        },
        {
            sender: "Yadu",
            message: "Thank you so much, Shiraz! This makes me feel more hopeful about managing my condition.",
            timestamp: new Date("2024-03-20T09:25:00"),
            isReceived: false
        },
        {
            sender: "Shiraz",
            message: "You're welcome! Remember, it gets easier with time. Feel free to message me anytime if you need support or have questions!",
            timestamp: new Date("2024-03-20T09:27:00"),
            isReceived: true
        }
    ]

    try {
        await mongoose.connect('mongodb+srv://codekochihack:tW8Hb7FtQ54MyR6u@cura.rljdi.mongodb.net/?retryWrites=true&w=majority&appName=cura')
        await Message.deleteMany({})
        await Message.insertMany(messages)
        console.log('Database seeded successfully')
        process.exit(0)
    } catch (error) {
        console.error('Error seeding database:', error)
        process.exit(1)
    }
}

seedDatabase()