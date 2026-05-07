/**
 * Halalbrite Event Form Logic - Single Page Version
 */

document.addEventListener('DOMContentLoaded', () => {
    // Quill Editor - Removed for reliability issues (huge icons)
    // Using standard textarea now.
    
    // Thumbnail Logic
    const thumbOpts = document.getElementsByName('thumbnailOption');
    thumbOpts.forEach(opt => {
        opt.onchange = function() {
            const container = document.getElementById('thumb-upload-container');
            if (container) container.style.display = (this.value === 'different') ? 'block' : 'none';
        };
    });

    // Event Type Switch
    const typeSwitch = document.getElementById('type-switch');
    if (typeSwitch) {
        typeSwitch.onchange = function() {
            const isOnline = this.checked;
            const locationCard = document.getElementById('location-card');
            const typeInput = document.getElementById('type-input');

            if (locationCard) locationCard.style.display = isOnline ? 'none' : 'block';
            if (typeInput) typeInput.value = isOnline ? 'Online' : 'In Person';
        };
    }

    // Dynamic Tickets Event Listener
    const ticketList = document.getElementById('ticket-list');
    if (ticketList) {
        ticketList.addEventListener('input', (e) => {
            if(e.target.classList.contains('tk-price')) {
                // Future: add calculation logic here if needed
            }
        });
    }
});

/**
 * AJAX Image Upload
 */
async function ajaxUpload(input, hid, prev, stat) {
    const s = document.getElementById(stat);
    if (!s) return;
    
    s.innerText = "⏳ Uploading...";
    const fd = new FormData();
    fd.append('image', input.files[0]);
    try {
        const r = await fetch('/admin/upload', { method:'POST', body:fd });
        const d = await r.json();
        if(r.ok) {
            document.getElementById(hid).value = d.url;
            const p = document.getElementById(prev); 
            if (p) {
                p.src = d.url; 
                p.style.display = 'block';
            }
            s.innerText = "✅ Success!";
        } else s.innerText = "❌ Error: " + d.message;
    } catch(e) { s.innerText = "❌ Network Error"; }
}

/**
 * Add New Ticket
 */
function addTicket() {
    const ticketList = document.getElementById('ticket-list');
    const ticketTpl = document.getElementById('ticket-tpl');
    if (!ticketList || !ticketTpl) return;

    const count = ticketList.querySelectorAll('.ticket-card').length;
    let html = ticketTpl.innerHTML.replace('Ticket #IDX', 'Ticket ' + (count + 1));
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    ticketList.appendChild(div.firstChild);
}

/**
 * Remove Ticket
 */
function removeTicket(btn) {
    const ticketList = document.getElementById('ticket-list');
    if (!ticketList) return;

    if(ticketList.querySelectorAll('.ticket-card').length > 1) {
        btn.closest('.ticket-card').remove();
        ticketList.querySelectorAll('.ticket-card').forEach((c, i) => {
            const label = c.querySelector('.ticket-label');
            if (label) label.innerText = 'Ticket ' + (i + 1);
        });
    }
}
