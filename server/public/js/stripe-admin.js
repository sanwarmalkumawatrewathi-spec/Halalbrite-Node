/**
 * Halalbrite Stripe Connect Administration JavaScript
 * Extracted from EJS templates to improve maintainability and CSP compliance.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Stripe Admin UI Initialized');
});

/**
 * Toggle visibility of submenus in the admin sidebar.
 * @param {string} id - The ID of the submenu element.
 */
function toggleSubmenu(id) {
    const menu = document.getElementById(id);
    if (!menu) return;

    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
    
    // Rotate chevron icon
    // First, find the parent button or current event target
    const trigger = event?.currentTarget;
    if (trigger) {
        const icon = trigger.querySelector('.fa-chevron-down');
        if (icon) {
            icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
}

/**
 * Common confirmation prompt for destructive actions.
 * @param {string} message - The message to show (optional).
 */
function confirmAction(message = 'Are you sure you want to proceed?') {
    return confirm(message);
}
