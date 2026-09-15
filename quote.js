// Replace this adapter when an actual enquiry endpoint is available.
export async function submitEnquiry(_enquiry) {
    return { sent: false, message: 'Online enquiries are not available yet. Your enquiry has not been sent.' };
}

export function setupQuoteForm(form, submit = submitEnquiry) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const button = form.querySelector('[type="submit"]');
        const status = form.querySelector('.form-status');
        button.disabled = true;
        try {
            const data = Object.fromEntries(new form.ownerDocument.defaultView.FormData(form));
            const result = await submit(data);
            status.textContent = result.message;
            if (result.sent) form.reset();
        } catch {
            status.textContent = 'Your enquiry could not be sent. Please try again later.';
        } finally {
            button.disabled = false;
        }
    });
}
