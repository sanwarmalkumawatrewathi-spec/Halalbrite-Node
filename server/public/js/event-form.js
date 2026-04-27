/**
 * Halalbrite Event Form Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Quill Editor
    const editorEl = document.getElementById('editor');
    if (editorEl) {
        window.quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: 'Describe your event, what attendees can expect, and any important details...',
            modules: { 
                toolbar: [
                    [{header:[1,2,3,false]}], 
                    ['bold', 'italic', 'underline'], 
                    [{list:'ordered'}, {list:'bullet'}], 
                    ['link', 'image']
                ] 
            }
        });

        // Load existing content safely
        const descInput = document.getElementById('desc-input');
        if (descInput && descInput.value) {
            window.quill.root.innerHTML = descInput.value;
        }

        // Sync on submit
        const form = document.getElementById('event-form');
        if (form) {
            form.onsubmit = () => { 
                descInput.value = window.quill.root.innerHTML; 
            };
        }
    }

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
            const typeHint = document.getElementById('type-hint');
            const labelIn = document.getElementById('label-in');
            const labelOn = document.getElementById('label-on');
            const typeInput = document.getElementById('type-input');

            if (locationCard) locationCard.style.display = isOnline ? 'none' : 'block';
            if (typeHint) typeHint.innerText = isOnline ? 'This is an online event' : 'This is an in-person event';
            if (labelIn) labelIn.className = isOnline ? 'label-on' : 'label-in';
            if (labelOn) labelOn.className = isOnline ? 'label-in' : 'label-on';
            if (typeInput) typeInput.value = isOnline ? 'Online' : 'In Person';
        };
    }

    // Organizer Display
    const orgSelect = document.getElementById('org-select');
    if (orgSelect) {
        orgSelect.onchange = function() {
            const name = this.options[this.selectedIndex].text;
            const orgDisplay = document.getElementById('org-display-name');
            const orgInput = document.getElementById('org-name-input');
            if (orgDisplay) orgDisplay.innerText = name;
            if (orgInput) orgInput.value = name;
        }
    }

    // Dynamic Tickets Event Listener
    const ticketList = document.getElementById('ticket-list');
    if (ticketList) {
        ticketList.addEventListener('input', (e) => {
            if(e.target.classList.contains('tk-price')) {
                calcRow(e.target.closest('.ticket-card'));
            }
        });

        ticketList.addEventListener('change', (e) => {
            if(e.target.classList.contains('fee-toggle')) {
                calcRow(e.target.closest('.ticket-card'));
            }
        });

        // Calculate initial rows
        calculateAll();
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
    calculateAll();
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

/**
 * Calculation Logic for a single row
 */
function calcRow(row) {
    if (!row) return;
    
    // Fetch constants from data attributes on the app container
    const app = document.getElementById('event-form-app');
    const SYM = app?.dataset.sym || '£';
    const PCT_P = parseFloat(app?.dataset.pctP) || 0;
    const FIX_P = parseFloat(app?.dataset.fixP) || 0;
    const PCT_V = parseFloat(app?.dataset.pctV) || 0;
    const PCT_S = parseFloat(app?.dataset.pctS) || 0;
    const FIX_S = parseFloat(app?.dataset.fixS) || 0;

    const priceEl = row.querySelector('.tk-price');
    const price = parseFloat(priceEl?.value) || 0;
    const passFees = row.querySelector('.fee-toggle')?.checked;

    // Platform Calculation
    const pFee = (price * (PCT_P / 100)) + FIX_P;
    const vFee = pFee * (PCT_V / 100);
    const sFee = (price * (PCT_S / 100)) + FIX_S;
    const totalFees = pFee + vFee + sFee;
    const totalPayable = passFees ? (price + totalFees) : price;

    // UI Updates
    const setUI = (selector, val, inputName) => {
        const el = row.querySelector(selector);
        if (el) el.innerText = SYM + val.toFixed(2);
        const input = row.querySelector(`input[name="${inputName}"]`);
        if (input) input.value = val.toFixed(2);
    };

    setUI('.v-platform', pFee, 'ticketPlatformFee');
    setUI('.v-vat', vFee, 'ticketVatFee');
    setUI('.v-stripe', sFee, 'ticketStripeFee');
    setUI('.v-total', totalFees, 'ticketTotalFees');

    // Hint Update
    const hint = row.querySelector('.fee-payment-info span:nth-child(2)');
    if (hint) hint.innerText = passFees ? 'Attendees pay the fees' : 'Organizer pays the fees';
    
    const buyerHint = row.querySelector('.buyer-total-hint');
    if (buyerHint) buyerHint.innerText = 'Customer will pay: ' + SYM + totalPayable.toFixed(2);
}

/**
 * Wizard Navigation
 */
window.currentStep = 1;

window.goToStep = function(step) {
    // Validate Current Step
    if (step > window.currentStep) {
        if (!validateStep(window.currentStep)) return;
    }

    // Hide all sections
    document.querySelectorAll('.form-section-card').forEach(s => s.classList.add('hidden'));

    // Show target section
    const targets = {
        1: 'basic-info-section',
        2: 'location-card',
        3: 'tickets-section'
    };
    
    const targetId = targets[step];
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
        targetEl.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update Progress UI
    document.querySelectorAll('.form-progress-steps .step').forEach((s, idx) => {
        if (idx + 1 === step) {
            s.classList.add('active');
        } else if (idx + 1 < step) {
            s.classList.add('active');
            s.querySelector('.step-num').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            s.classList.remove('active');
            s.querySelector('.step-num').innerText = idx + 1;
        }
    });

    window.currentStep = step;
};

function validateStep(step) {
    const sectionId = { 1: 'basic-info-section', 2: 'location-card' }[step];
    if (!sectionId) return true;

    const section = document.getElementById(sectionId);
    const inputs = section.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            valid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    if (!valid) {
        alert('Please fill in all required fields before proceeding.');
    }
    return valid;
}

// Initial State
document.addEventListener('DOMContentLoaded', () => {
    // Hide all except first
    document.querySelectorAll('.form-section-card').forEach((s, idx) => {
        if (idx > 0) s.classList.add('hidden');
    });
    
    // ... existing init code ...
});
