const cron = require('node-cron');
const Event = require('../models/eventModel');

const initCronJobs = () => {
    cron.schedule('5 0 * * *', async () => {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            console.log("[Cron Job] Cleaning past events...");

            const result = await Event.deleteMany({
                date: { $lt: startOfToday }
            });
            if (result.deletedCount > 0) {
                console.log(`[Cron Job] Deleted ${result.deletedCount} events.`);
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