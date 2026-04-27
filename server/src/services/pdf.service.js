const puppeteer = require('puppeteer');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');

class PdfService {
    async generateTicketPdf(booking) {
        let browser = null;
        try {
            // 1. Generate QR Code Data URL
            const qrCodeDataUrl = await qrcode.toDataURL(booking.booking_reference);

            // 2. Prepare Template Content
            const htmlContent = this._getTicketTemplate(booking, qrCodeDataUrl);

            // 3. Launch Puppeteer
            browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            // 4. Set Content
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // 5. Generate PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
            });

            return pdfBuffer;
        } catch (error) {
            console.error('❌ PDF Generation Error:', error);
            throw error;
        } finally {
            if (browser) await browser.close();
        }
    }

    _getTicketTemplate(booking, qrCode) {
        const dateStr = new Date(booking.event_date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let pagesHtml = '';
        const qty = booking.quantity || 1;

        for (let i = 1; i <= qty; i++) {
            pagesHtml += `
            <div class="ticket-page" style="${i < qty ? 'page-break-after: always;' : ''}">
                <div class="ticket-container">
                    <div class="header">
                        <div class="logo">HalalBrite</div>
                        <div class="booking-ref">Reference: ${booking.booking_reference} | Ticket ${i} of ${qty}</div>
                    </div>
                    
                    <div class="content">
                        <div class="info-section">
                            <div class="event-title">${booking.event_name}</div>
                            
                            <div class="detail-item">
                                <div class="detail-label">Ticket Holder</div>
                                <div class="detail-value">${booking.customer_name}</div>
                            </div>

                            <div style="display: flex; gap: 40px;">
                                <div class="detail-item">
                                    <div class="detail-label">Date</div>
                                    <div class="detail-value">${dateStr}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Time</div>
                                    <div class="detail-value">${booking.event_time || '11:00 AM - 7:00 PM'}</div>
                                </div>
                            </div>

                            <div class="detail-item">
                                <div class="detail-label">Venue</div>
                                <div class="detail-value">${booking.event_venue}</div>
                                <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">${booking.event_location}</div>
                            </div>

                            <div class="detail-item">
                                <div class="detail-label">Ticket Type</div>
                                <div class="detail-value">${booking.ticket_name}</div>
                            </div>
                        </div>

                        <div class="qr-section">
                            <img src="${qrCode}" class="qr-code" />
                            <div style="font-size: 14px; font-weight: 900; color: #111827;">SCAN TO ENTER</div>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="important">IMPORTANT INFORMATION</div>
                        • This ticket is valid for one-person entry only.<br/>
                        • Please present this PDF or a printed copy at the entrance.<br/>
                        • Admission is subject to the venue's terms and conditions.<br/>
                        • Keep this ticket safe and do not share it with others.
                    </div>
                </div>
            </div>
            `;
        }

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #fef3f6;
                }
                .ticket-page {
                    padding: 40px;
                    box-sizing: border-box;
                    min-height: 100vh;
                }
                .ticket-container {
                    width: 100%;
                    background: white;
                    border-radius: 40px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(220, 38, 38, 0.1);
                    border: 1px solid #fee2e2;
                }
                .header {
                    background-color: #dc2626;
                    padding: 40px;
                    color: white;
                    text-align: center;
                }
                .logo {
                    font-size: 32px;
                    font-weight: 900;
                    margin-bottom: 10px;
                }
                .booking-ref {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    opacity: 0.8;
                }
                .content {
                    padding: 40px;
                    display: flex;
                    gap: 40px;
                }
                .info-section {
                    flex: 1;
                }
                .qr-section {
                    width: 200px;
                    text-align: center;
                }
                .event-title {
                    font-size: 24px;
                    font-weight: 900;
                    color: #111827;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }
                .detail-item {
                    margin-bottom: 20px;
                }
                .detail-label {
                    font-size: 10px;
                    font-weight: 900;
                    color: #dc2626;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                }
                .detail-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: #374151;
                }
                .qr-code {
                    width: 100%;
                    margin-bottom: 15px;
                }
                .footer {
                    background-color: #f9fafb;
                    padding: 30px 40px;
                    border-top: 2px dashed #e5e7eb;
                    font-size: 12px;
                    color: #6b7280;
                    line-height: 1.6;
                }
                .important {
                    color: #92400e;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body>
            ${pagesHtml}
        </body>
        </html>
        `;
    }
}

module.exports = new PdfService();
