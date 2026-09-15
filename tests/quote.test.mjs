import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { setupQuoteForm, submitEnquiry } from '../quote.js';

function fixture() {
    const dom = new JSDOM(`<form><input name="name" required value="Test Person"><input name="email" type="email" required value="test@example.com"><textarea name="message">Site enquiry</textarea><button type="submit">Send</button><p class="form-status" role="status"></p></form>`);
    return { dom, form: dom.window.document.querySelector('form') };
}
async function send(dom, form) {
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setImmediate(resolve));
}
test('unconfigured submission never claims delivery or clears the enquiry', async () => {
    assert.equal((await submitEnquiry({})).sent, false);
    const { dom, form } = fixture();
    setupQuoteForm(form);
    await send(dom, form);
    assert.match(form.querySelector('.form-status').textContent, /has not been sent/);
    assert.equal(form.elements.name.value, 'Test Person');
    assert.equal(form.querySelector('button').disabled, false);
});
test('invalid email blocks the adapter', async () => {
    const { dom, form } = fixture();
    let calls = 0;
    setupQuoteForm(form, async () => { calls++; });
    form.elements.email.value = 'invalid';
    await send(dom, form);
    assert.equal(calls, 0);
});
test('adapter errors preserve input and restore the submit button', async () => {
    const { dom, form } = fixture();
    setupQuoteForm(form, async (data) => {
        assert.equal(data.message, 'Site enquiry');
        throw new Error('Unavailable');
    });
    await send(dom, form);
    assert.match(form.querySelector('.form-status').textContent, /could not be sent/);
    assert.equal(form.elements.name.value, 'Test Person');
    assert.equal(form.querySelector('button').disabled, false);
});
