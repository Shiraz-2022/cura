export const threadData = [
  {
    id: 1,
    Name: "Shiraz yousuf",
    comment:
      "This is a small description of the content This is just a random text.",
    upvotes: "75k",
    time: "12hrs",
    subThreads: [],
  },
  {
    id: 2,
    Name: "Shiraz yousuf",
    comment:
      "This is a small description of the content This is just a random text.",
    upvotes: "7.5k",
    time: "12hrs",
    subThreads: [],
  },
  {
    id: 3,
    Name: "Shiraz yousuf",
    comment:
      "This is a small description of the content This is just a random text.",
    upvotes: "7.5k",
    time: "12hrs",
    subThreads: [
      {
        id: 4,
        Name: "Shiraz yousuf",
        comment:
          "This is a small description of the content This is just a random text.",
        upvotes: "75k",
        time: "12hrs",
        subThreads: [
          {
            id: 5,
            Name: "Shiraz yousuf",
            comment:
              "This is a small description of the content This is just a random text.",
            upvotes: "75k",
            time: "12hrs",
            subThreads: [
              {
                id: 6,
                Name: "Shiraz yousuf",
                comment:
                  "This is a small description of the content This is just a random text.",
                upvotes: "75k",
                time: "12hrs",
                subThreads: [
                  {
                    id: 7,
                    Name: "Shiraz yousuf",
                    comment:
                      "This is a small description of the content This is just a random text.",
                    upvotes: "75k",
                    time: "12hrs",
                    subThreads: [
                      {
                        id: 8,
                        Name: "Shiraz yousuf",
                        comment:
                          "This is a small description of the content This is just a random text.",
                        upvotes: "75k",
                        time: "12hrs",
                        subThreads: [
                          {
                            id: 9,
                            Name: "Shiraz yousuf",
                            comment:
                              "This is a small description of the content This is just a random text.",
                            upvotes: "75k",
                            time: "12hrs",
                            subThreads: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 10,
        Name: "Shiraz yousuf",
        comment:
          "This is a small description of the content This is just a random text.",
        upvotes: "75k",
        time: "12hrs",
        subThreads: [],
      },
    ],
  },
];

export const chatData = [
  {
    id: 1,
    sender: "John Doe",
    message: "Hey, how are you doing?",
    timestamp: new Date("2024-12-22T10:00:00"),
    isReceived: false,
  },
  {
    id: 2,
    sender: "You",
    message: "I'm good, thanks! How about you?",
    timestamp: new Date("2024-12-22T10:02:00"),
    isReceived: true,
  },
  {
    id: 3,
    sender: "John Doe",
    message: "Not bad, just enjoying my weekend. Got any plans?",
    timestamp: new Date("2024-12-22T10:05:00"),
    isReceived: false,
  },
  {
    id: 4,
    sender: "You",
    message: "Thinking about catching a movie later. What about you?",
    timestamp: new Date("2024-12-22T10:07:00"),
    isReceived: true,
  },
  {
    id: 5,
    sender: "John Doe",
    message: "Sounds fun! I might join you if that's okay.",
    timestamp: new Date("2024-12-22T10:10:00"),
    isReceived: false,
  },
  {
    id: 6,
    sender: "You",
    message: "Sure",
    timestamp: new Date("2024-12-22T10:07:00"),
    isReceived: true,
  },
  {
    id: 7,
    sender: "You",
    message: "You can join",
    timestamp: new Date("2024-12-22T10:07:00"),
    isReceived: true,
  },
  {
    id: 8,
    sender: "John Doe",
    message: "okay, lets do it",
    timestamp: new Date("2024-12-22T10:10:00"),
    isReceived: false,
  },
];

export const chatbotData = [
  {
    id: 1,
    prompt: "Hello! What can you help me with?",
    reply:
      "Hi there! I can assist with general questions, scheduling, and more. How can I help?",
    timestamp: new Date("2024-12-22T09:00:00"),
  },
  {
    id: 2,
    prompt: "Can you tell me the weather for today?",
    reply:
      "Sure! Please provide your location to get the current weather details.",
    timestamp: new Date("2024-12-22T09:05:00"),
  },
  {
    id: 3,
    prompt: "What's the capital of France?",
    reply: "The capital of France is Paris.",
    timestamp: new Date("2024-12-22T09:10:00"),
  },
  {
    id: 4,
    prompt: "How do I make a cake?",
    reply:
      "To make a cake, you need flour, sugar, eggs, butter, and baking powder. Mix the ingredients, bake at 180°C for 30 minutes, and enjoy!",
    timestamp: new Date("2024-12-22T09:15:00"),
  },
  {
    id: 5,
    prompt: "Can you set a reminder for me?",
    reply:
      "Of course! Let me know what you want to be reminded about and the time.",
    timestamp: new Date("2024-12-22T09:20:00"),
  },
  {
    id: 6,
    prompt: "Tell me a joke!",
    reply: "Why don’t skeletons fight each other? They don’t have the guts!",
    timestamp: new Date("2024-12-22T09:25:00"),
  },
  {
    id: 7,
    prompt: "Can you recommend a movie?",
    reply:
      "Sure! How about 'Inception'? It’s a great mix of action, drama, and mind-bending storytelling.",
    timestamp: new Date("2024-12-22T09:30:00"),
  },
  {
    id: 8,
    prompt: "What's 45 times 32?",
    reply: "45 times 32 is 1440.",
    timestamp: new Date("2024-12-22T09:35:00"),
  },
  {
    id: 9,
    prompt: "How do I learn programming?",
    reply:
      "Start with a beginner-friendly language like Python, practice coding regularly, and explore resources like freeCodeCamp and Codecademy.",
    timestamp: new Date("2024-12-22T09:40:00"),
  },
  {
    id: 10,
    prompt: "What’s the latest news?",
    reply: "Let me check the latest news for you. One moment, please!",
    timestamp: new Date("2024-12-22T09:45:00"),
  },
];
