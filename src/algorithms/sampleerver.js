import fs from 'fs';
import admin from 'firebase-admin';
import express from 'express';
import { db, connectToDb } from './db.js';

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json')
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
    console.log('its in app.use code to check the authentication');
    const { authtoken } = req.headers;
    console.log('the authtoken is', authtoken);
    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
            console.log('req.user is :', req.user);
        } catch (e) {
            return res.sendStatus(400);
        }
    }

    req.user = req.user || {};
    
    next();
});


app.get('/api/tasks', async (req, res) => {
    console.log("is inside the get endpoint");
    //const { userid } = req.params;
    //console.log(userid);
    const {uid} = req.user;
    console.log('the currently logged in user is: ',uid);
    const tasks = await db.collection('taskdata').find({ userId: uid }).toArray();
    console.log(tasks);

    if (tasks.length>0) {
        res.json(tasks);
        console.log("in the if statement");
    } else {
        res.sendStatus(404);
        console.log("in the else");
    }
});

app.get('/api/schedule', async (req, res) => {
    console.log("is inside the get schedule endpoint");

    try {
        const { uid } = req.user;
        console.log('the currently logged in user is: ', uid);
        const scheduleData = await db.collection('schedule').find({ userId: uid }).toArray();
        const schedules = scheduleData.map(item => item.schedule);
        res.json(schedules);
        console.log("Schedule data fetched successfully", schedules);
        schedules.forEach(schedule => {
            Object.entries(schedule).forEach(([date, tasks]) => {
                console.log(`Date: ${date}`);
                tasks.forEach(task => {
                    console.log(`Task: ${task.taskName}, Hours: ${task.hours}`);
                });
            });
        });
        
    } catch (error) {
        console.error('Error fetching schedule data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Function to schedule tasks
const scheduleTasks = async (tasks, userId) => {
    try {
        // Sort tasks based on priority
        const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);
        // Initialize schedule object
        const schedule = {};

        // Iterate through sorted tasks
        for (const task of sortedTasks) {
            // Extract task details
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.dueDate);
            const estimatedDays = Math.ceil(task.estimatedCompletionTime / task.dailyProgress);
            let currentDate = new Date(startDate);

            // Loop through each day of the task
            for (let day = 0; day < estimatedDays; day++) {
                // Break loop if current date exceeds end date
                if (currentDate > endDate) {
                    break;
                }

                // Calculate remaining hours for the day
                const remainingHours = Math.min(task.dailyProgress, task.estimatedCompletionTime);
                // Add task to schedule for the current date
                if (!schedule[currentDate]) {
                    schedule[currentDate] = [];
                }
                schedule[currentDate].push({ taskName: task.title, hours: remainingHours });

                // Increment current date by one day
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        // Save the updated schedule to MongoDB
        await db.collection('schedule').updateOne(
            { userId: userId },
            { $set: { schedule } },
            { upsert: true } // Create a new document if it doesn't exist
        );
    } catch (error) {
        console.error('Error saving schedule to MongoDB:', error);
        throw error;
    }
};

// POST endpoint to add event data to the taskdata collection
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, startDate, dueDate, estimatedCompletionTime, dailyProgress, priority, userId } = req.body;
        // Basic validation to ensure required fields are present
        if (!title || !startDate || !dueDate || !estimatedCompletionTime || !dailyProgress || !priority || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const eventData = {
            title,
            startDate,
            dueDate,
            estimatedCompletionTime,
            dailyProgress,
            priority,
            userId
        };

        // Create the new task in the database
        await db.collection('taskdata').insertOne(eventData);

        // Generate the schedule for the current user
        const userTasks = await db.collection('taskdata').find({ userId }).toArray();
        await scheduleTasks(userTasks, userId);

        // Fetch all tasks including the newly added one
        //const allTasks = await db.collection('taskdata').find({ userId }).toArray();

        // Generate the schedule
       // const schedule = scheduleTasks(allTasks);

        // Return the schedule along with the newly added task
        res.status(201).json({ message: 'Event data added successfully' });
    } catch (error) {
        console.error('Error adding event data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



connectToDb(() => {
    console.log('Successfully connected to database!');
    app.listen(8000, () => {
        console.log('Server is listening on port 8000');
    });
})