const cron = require('node-cron');
const Event = require('../models/eventModel');

const initCronJobs = () => {
    cron.schedule('5 0 * * *', async () => {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            console.log("[Cron Job] Marking past events as completed...");

            const result = await Event.updateMany({
                date: { $lt: startOfToday },
                status: 'upcoming'
            }, {
                $set: {
                    status: 'completed',
                    archivedAt: new Date()
                }
            });
            if (result.modifiedCount > 0) {
                console.log(`[Cron Job] Marked ${result.modifiedCount} events as completed.`);
            }
        } catch (error) {
            console.error("[Cron Job] Error:", error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });

    console.log("[Cron Job] Scheduler initialized successfully.");
};

module.exports = initCronJobs;
