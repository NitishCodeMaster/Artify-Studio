const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Return a dummy fallback logger transporter if no credentials set yet
    return {
        sendMail: async (mailOptions) => {
            console.log("📧 [EMAIL UTILITY SIMULATION]");
            console.log(`To: ${mailOptions.to}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log(`Body Snippet: ${mailOptions.text || mailOptions.html.slice(0, 100)}...`);
            return { messageId: 'simulated-email-id' };
        }
    };
};

exports.sendGigSelectionEmail = async ({
    artistEmail,
    artistName,
    gigTitle,
    gigDate,
    gigTime,
    gigLocation,
    payout,
    organizerName,
    gigId
}) => {
    try {
        if (!artistEmail) {
            console.log("⚠️ No artist email provided for gig selection notification.");
            return;
        }

        const transporter = createTransporter();

        const formattedDate = new Date(gigDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const gigUrl = `${clientUrl}/events`;

        const htmlContent = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d14; color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #222;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff;">ARTIFY STUDIO</h1>
                <p style="margin: 5px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.8);">Gig Selection Confirmation</p>
            </div>
            
            <div style="padding: 30px 25px;">
                <h2 style="color: #10b981; margin-top: 0; font-size: 22px;">🎉 Congratulations, ${artistName || 'Artist'}!</h2>
                <p style="font-size: 14px; color: #d1d5db; line-height: 1.6;">
                    We are thrilled to inform you that <strong>${organizerName || 'The Event Organizer'}</strong> has selected you for the following performance gig:
                </p>

                <div style="background-color: #181824; border: 1px solid #333; border-radius: 16px; p-20px; margin: 20px 0; padding: 20px;">
                    <h3 style="margin-top: 0; color: #f59e0b; font-size: 18px;">${gigTitle}</h3>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e5e7eb;">
                        <tr>
                            <td style="padding: 6px 0; color: #9ca3af; width: 35%;">📅 Date:</td>
                            <td style="padding: 6px 0; font-weight: bold;">${formattedDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #9ca3af;">⏰ Time:</td>
                            <td style="padding: 6px 0; font-weight: bold;">${gigTime || 'TBA'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; color: #9ca3af;">📍 Venue:</td>
                            <td style="padding: 6px 0; font-weight: bold;">${gigLocation}</td>
                        </tr>
                        ${payout > 0 ? `
                        <tr>
                            <td style="padding: 6px 0; color: #9ca3af;">💰 Agreed Payout:</td>
                            <td style="padding: 6px 0; font-weight: bold; color: #10b981;">₹${payout}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${gigUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #000000; text-decoration: none; padding: 14px 30px; font-weight: 900; border-radius: 12px; font-size: 14px; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
                        View Gig Booking & Pass 🚀
                    </a>
                </div>

                <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 25px;">
                    Please contact the organizer or check your Artify Messages for gate instructions and setup timings.
                </p>
            </div>

            <div style="background-color: #050508; border-t: 1px solid #1a1a24; padding: 15px; text-align: center; font-size: 11px; color: #6b7280;">
                © 2026 Artify Studio Creative Network. All rights reserved.
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Artify Studio" <no-reply@artify.com>',
            to: artistEmail,
            subject: `🎉 Selected for Gig: ${gigTitle}!`,
            html: htmlContent
        });

        console.log(`✅ Gig Selection Email sent successfully to ${artistEmail}`);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};
