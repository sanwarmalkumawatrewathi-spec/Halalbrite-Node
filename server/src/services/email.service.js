const nodemailer = require('nodemailer');
const AppSetting = require('../models/appSetting.model');
const EmailLog = require('../models/emailLog.model');

class EmailService {
    async getTransporter() {
        const settings = await AppSetting.findOne();
        const smtp = settings?.smtp;

        if (!smtp || !smtp.host) {
            console.warn('⚠️ SMTP settings not found in database. Falling back to environment variables.');
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
                port: process.env.EMAIL_PORT || 2525,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        }

        return nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.port === 465, // true for 465, false for other ports
            auth: {
                user: smtp.user,
                pass: smtp.pass,
            },
        });
    }

    async sendTicketEmail(booking, pdfBuffer, recipientEmail, recipientRole = 'attendee') {
        try {
            const recipient = recipientEmail || booking.customer_email;
            const settings = await AppSetting.findOne();
            const fromEmail = settings?.smtp?.fromEmail || process.env.EMAIL_FROM || 'noreply@halalbrite.com';
            const fromName = settings?.smtp?.fromName || 'HalalBrite';

            const transporter = await this.getTransporter();
            const dateStr = new Date(booking.event_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // HTML Template based on Screenshot
            const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                    .header { padding: 30px; text-align: center; }
                    .logo-img { height: 50px; margin-bottom: 5px; }
                    .brand-name { font-weight: bold; font-size: 20px; color: #dc3545; vertical-align: middle; }
                    
                    .success-banner { background-color: #e6f9f0; border: 1px solid #c3e6cb; border-radius: 12px; margin: 0 30px 30px; padding: 30px; text-align: center; }
                    .check-icon { background: #28a745; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px; line-height: 40px; }
                    .success-title { color: #155724; font-size: 22px; font-weight: bold; margin: 0 0 10px; }
                    .success-msg { color: #155724; font-size: 14px; margin: 0; }

                    .content { padding: 0 30px 30px; }
                    .greeting { font-size: 16px; font-weight: bold; margin-bottom: 15px; }
                    .intro { font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 25px; }
                    .event-name-link { color: #dc3545; font-weight: bold; text-decoration: none; }

                    .ref-box { background: #fff5f6; border: 1px solid #ffccd2; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
                    .ref-label { font-size: 11px; color: #dc3545; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
                    .ref-value { font-size: 18px; font-weight: 900; color: #821c2c; }

                    .section-card { border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
                    .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #333; }
                    .detail-row { display: flex; margin-bottom: 12px; }
                    .detail-icon { font-size: 18px; margin-right: 12px; width: 24px; text-align: center; }
                    .detail-label { font-size: 11px; color: #999; text-transform: uppercase; }
                    .detail-text { font-size: 14px; font-weight: bold; color: #444; }

                    .order-table { width: 100%; border-collapse: collapse; }
                    .order-row td { padding: 12px 0; border-bottom: 1px solid #f1f1f1; font-size: 14px; }
                    .total-row td { padding: 15px 0; font-weight: bold; border-bottom: none; }
                    .total-price { font-size: 18px; color: #dc3545; }

                    .footer { background: #f8f9fa; padding: 30px; text-align: center; font-size: 12px; color: #999; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://halalbrite.com/logo.png" class="logo-img" alt="Logo">
                        <span class="brand-name">HalalBrite</span>
                    </div>

                    <div class="success-banner">
                        <div class="check-icon">✓</div>
                        <h2 class="success-title">Booking Confirmed!</h2>
                        <p class="success-msg">Congratulations! Your tickets have been successfully booked.</p>
                    </div>

                    <div class="content">
                        <div class="greeting">
                            ${recipientRole === 'organizer' ? 'Hello Organizer,' : (recipientRole === 'admin' ? 'Hello Admin,' : `Dear ${booking.customer_name},`)}
                        </div>
                        <p class="intro">
                            ${recipientRole === 'organizer' ? `A new ticket has been sold for your event: <b>${booking.event_name}</b>.` : (recipientRole === 'admin' ? `A new ticket has been sold on the platform for the event: <b>${booking.event_name}</b>.` : `Thank you for booking with HalalBrite! We're excited to confirm your attendance at <span class="event-name-link">${booking.event_name}</span>.`)}
                            <br><br>
                            ${recipientRole === 'attendee' ? 'Your tickets are attached to this email as PDF files. Please download and keep them safe, or show them on your mobile device at the event entrance.' : 'The booking details and tickets are attached below for your records.'}
                        </p>

                        <div class="ref-box">
                            <div>
                                <div class="ref-label">Booking Reference</div>
                                <div class="ref-value">${booking.booking_reference}</div>
                            </div>
                            <div style="background:white; padding:5px; border-radius:4px; border:1px solid #eee;">
                                <img src="https://cdn-icons-png.flaticon.com/512/241/241528.png" width="40" height="40" alt="QR">
                            </div>
                        </div>

                        <div class="section-card">
                            <div class="section-title">Event Details</div>
                            <div class="detail-row">
                                <span class="detail-icon">📅</span>
                                <div><div class="detail-label">Date</div><div class="detail-text">${dateStr}</div></div>
                            </div>
                            <div class="detail-row">
                                <span class="detail-icon">⏰</span>
                                <div><div class="detail-label">Time</div><div class="detail-text">${booking.event_time || '11:00 AM - 7:00 PM'}</div></div>
                            </div>
                            <div class="detail-row">
                                <span class="detail-icon">📍</span>
                                <div><div class="detail-label">Location</div><div class="detail-text">${booking.event_venue}, ${booking.event_location}</div></div>
                            </div>
                        </div>

                        <div class="section-card">
                            <div class="section-title">Order Summary</div>
                            <table class="order-table">
                                <tr class="order-row">
                                    <td>${booking.ticket_name} (Qty: ${booking.quantity})</td>
                                    <td align="right">${booking.currency || '£'}${booking.amount_total.toFixed(2)}</td>
                                </tr>
                                <tr class="total-row">
                                    <td>Total Paid</td>
                                    <td align="right" class="total-price">${booking.currency || '£'}${booking.amount_total.toFixed(2)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    <div class="footer">
                        &copy; 2026 HalalBrite. All rights reserved.<br>
                        Support: support@halalbrite.com | Web: www.halalbrite.com
                    </div>
                </div>
            </body>
            </html>
            `;

            const mailOptions = {
                from: `"${fromName}" <${fromEmail}>`,
                to: recipient,
                subject: recipientRole === 'attendee' ? `Your Tickets for ${booking.event_name}` : `New Booking Notification: ${booking.event_name}`,
                html: htmlContent,
                attachments: [
                    {
                        filename: `Ticket-${booking.booking_reference}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('✅ Ticket Email Sent: %s', info.messageId);

            // Log Success
            await EmailLog.create({
                booking_id: booking._id,
                recipient: recipient,
                role: recipientRole,
                subject: mailOptions.subject,
                status: 'sent',
                messageId: info.messageId
            });

            return info;
        } catch (error) {
            console.error('❌ Email Sending Error:', error);
            
            // Log Failure
            try {
                await EmailLog.create({
                    booking_id: booking?._id,
                    recipient: recipientEmail || booking?.customer_email || 'unknown',
                    role: recipientRole,
                    subject: `Ticket Delivery for ${booking?.event_name || 'unknown'}`,
                    status: 'failed',
                    error: error.message
                });
            } catch (logErr) { console.error('Failed to log email error:', logErr); }

            throw error;
        }
    }

    async sendNotificationEmail(to, subject, title, message, booking = null) {
        try {
            const settings = await AppSetting.findOne();
            const fromEmail = settings?.smtp?.fromEmail || process.env.EMAIL_FROM || 'noreply@halalbrite.com';
            const fromName = settings?.smtp?.fromName || 'HalalBrite';
            const transporter = await this.getTransporter();

            const html = `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #dc3545;">${title}</h2>
                    <p>${message}</p>
                    ${booking ? `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            <strong>Booking Ref:</strong> ${booking.booking_reference}<br>
                            <strong>Event:</strong> ${booking.event_name}<br>
                            <strong>Customer:</strong> ${booking.customer_name} (${booking.customer_email})<br>
                            <strong>Amount:</strong> ${booking.currency}${booking.amount_total}
                        </div>
                    ` : ''}
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">This is an automated notification from HalalBrite.</p>
                </div>
            `;

            await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to,
                subject,
                html
            });
        } catch (error) {
            console.error('❌ Notification Email Error:', error);
        }
    }

    async sendInquiryEmail(inquiry) {
        try {
            const settings = await AppSetting.findOne();
            const fromEmail = settings?.smtp?.fromEmail || process.env.EMAIL_FROM || 'noreply@halalbrite.com';
            const fromName = settings?.smtp?.fromName || 'HalalBrite';
            const adminEmail = process.env.ADMIN_EMAIL || fromEmail;

            const transporter = await this.getTransporter();

            // 1. Send Notification to Admin
            const adminHtml = `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">New Contact Inquiry</h2>
                    <p>You have received a new message from the contact form:</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${inquiry.fullName}</p>
                        <p><strong>Email:</strong> ${inquiry.email}</p>
                        <p><strong>Subject:</strong> ${inquiry.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap;">${inquiry.message}</p>
                    </div>
                    <p style="font-size: 12px; color: #888;">Submitted on: ${new Date(inquiry.createdAt).toLocaleString()}</p>
                </div>
            `;

            await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: adminEmail,
                subject: `New Inquiry: ${inquiry.subject}`,
                html: adminHtml
            });

            // 2. Send Thank You to Visitor
            const visitorHtml = `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #dc3545; margin: 0;">HalalBrite</h1>
                    </div>
                    <h2 style="color: #333;">Thank You for Contacting Us!</h2>
                    <p>Dear ${inquiry.fullName},</p>
                    <p>We have received your inquiry regarding "<strong>${inquiry.subject}</strong>". Our team will review your message and get back to you as soon as possible.</p>
                    <div style="background: #fff5f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                        <p style="margin: 0; font-style: italic;">"We aim to respond to all inquiries within 24-48 business hours."</p>
                    </div>
                    <p>Best Regards,<br>The HalalBrite Team</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 11px; color: #999; text-align: center;">&copy; 2026 HalalBrite. All rights reserved.</p>
                </div>
            `;

            const infoUser = await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: inquiry.email,
                subject: `Thank you for contacting HalalBrite`,
                html: visitorHtml
            });

            console.log('✅ Inquiry Emails Sent successfully');

            // Log Success for Admin
            await EmailLog.create({
                recipient: adminEmail,
                role: 'admin',
                subject: `New Inquiry: ${inquiry.subject}`,
                status: 'sent',
                messageId: infoAdmin.messageId
            });

            // Log Success for User
            await EmailLog.create({
                recipient: inquiry.email,
                role: 'attendee',
                subject: 'We received your inquiry',
                status: 'sent',
                messageId: infoUser.messageId
            });

            return true;
        } catch (error) {
            console.error('❌ Inquiry Email Error:', error);

            // Log Failure
            await EmailLog.create({
                recipient: 'admin/user',
                role: 'inquiry',
                subject: 'Inquiry Delivery Failed',
                status: 'failed',
                error: error.message
            });

            return false;
        }
    }
}

module.exports = new EmailService();
