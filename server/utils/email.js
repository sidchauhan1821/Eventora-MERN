const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("Email sent successfully to", userEmail);
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "Verify your Eventora Account"
        : "Eventora Booking Verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventora account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: title,
      html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>

                    <p style="color: #555; font-size: 16px;">
                        ${msg}
                    </p>

                    <div style="
                        margin: 20px auto;
                        padding: 15px;
                        font-size: 24px;
                        font-weight: bold;
                        background: #f4f4f4;
                        width: max-content;
                        letter-spacing: 5px;
                    ">
                        ${otp}
                    </div>

                    <p style="color: #999; font-size: 12px;">
                        This code expires in 5 minutes. If you didn't request this, please ignore this email.
                    </p>
                </div>
            `,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`OTP sent to ${userEmail} for ${type}`);
    return data;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = {
  sendBookingEmail,
  sendOTPEmail,
};
