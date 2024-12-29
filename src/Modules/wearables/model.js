const mongoose = require('mongoose')

const wearableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityData: {
    steps: Number,
    distance: Number,
    floorsClimbed: Number,
    activeMinutes: Number,
    caloriesBurned: Number,
    timestamp: Date
  },
  heartRate: {
    bpm: Number,
    variability: Number,
    restingRate: Number,
    timestamp: Date
  },
  bloodGlucose: {
    level: Number,
    timestamp: Date,
    unit: {
      type: String,
      enum: ['mg/dL', 'mmol/L']
    },
    mealContext: {
      type: String,
      enum: ['fasting', 'beforeMeal', 'afterMeal']
    }
  },
  sleepMetrics: {
    startTime: Date,
    endTime: Date,
    totalDuration: Number,
    stages: [{
      stage: {
        type: String,
        enum: ['light', 'deep', 'rem', 'awake']
      },
      duration: Number,
      startTime: Date
    }],
    respirationRate: Number,
    oxygenSaturation: Number
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number,
    pulse: Number,
    timestamp: Date,
    position: {
      type: String,
      enum: ['sitting', 'standing', 'lying']
    }
  },
  bodyMetrics: {
    weight: Number,
    bodyFat: Number,
    muscleMass: Number,
    bmi: Number,
    timestamp: Date
  },
  stressLevel: {
    score: Number,
    timestamp: Date
  },
  deviceInfo: {
    deviceId: String,
    deviceType: String,
    manufacturer: String,
    firmwareVersion: String,
    batteryLevel: Number,
    lastSync: Date
  }
}, {
  timestamps: true
})

const Wearable = mongoose.model('Wearable', wearableSchema)

module.exports = Wearable