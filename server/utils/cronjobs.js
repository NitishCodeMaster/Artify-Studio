const cron = require('node-cron');
const Event = require('../models/eventModel');

const initCronJobs = () => {
    // Run every hour to purge past expired gigs and mark completed events
    cron.schedule('0 * * * *', async () => {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const yesterday = new Date(startOfToday);
            yesterday.setDate(yesterday.getDate() - 1);

            // Purge past gigs older than 24 hours
            const deleteResult = await Event.deleteMany({
                date: { $lt: yesterday }
            });

            // Mark past events whose date has passed as completed
            const updateResult = await Event.updateMany({
                date: { $lt: startOfToday },
                status: 'upcoming'
            }, {
                $set: {
                    status: 'completed',
                    archivedAt: new Date()
                }
            });

            if (deleteResult.deletedCount > 0) {
                console.log(`[Cron Job] Purged ${deleteResult.deletedCount} expired gig(s).`);
            }
            if (updateResult.modifiedCount > 0) {
                console.log(`[Cron Job] Marked ${updateResult.modifiedCount} event(s) as completed.`);
            }
        } catch (error) {
            console.error("[Cron Job] Error:", error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });

    console.log("[Cron Job] Hourly gig cleanup scheduler initialized successfully.");
};

module.exports = initCronJobs;
