const checkin = document.querySelector('#checkin');
const checkout = document.querySelector('#checkout');
const dialog = document.querySelector('#booking-dialog');
const guestForm = document.querySelector('#guest-form');
const message = document.querySelector('#form-message');

const today = new Date();
const localDate = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
checkin.min = localDate(today);
checkin.value = localDate(today);
const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
checkout.min = localDate(tomorrow);
checkout.value = localDate(tomorrow);

function syncCheckout(startInput, endInput) {
  if (!startInput.value) return;
  const nextDay = new Date(`${startInput.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate()+1);
  const minimum = localDate(nextDay);
  endInput.min = minimum;
  if (!endInput.value || endInput.value < minimum) endInput.value = minimum;
}
checkin.addEventListener('change', () => syncCheckout(checkin, checkout));

document.querySelector('#booking').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#rooms').scrollIntoView({behavior:'smooth'});
});

document.querySelectorAll('[data-room]').forEach(button => button.addEventListener('click', () => {
  guestForm.reset();
  message.textContent = '';
  guestForm.elements.roomType.value = button.dataset.room;
  guestForm.elements.checkIn.value = checkin.value;
  guestForm.elements.checkOut.value = checkout.value;
  syncCheckout(guestForm.elements.checkIn, guestForm.elements.checkOut);
}));

guestForm.elements.checkIn.addEventListener('change', () => syncCheckout(guestForm.elements.checkIn, guestForm.elements.checkOut));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());

guestForm.addEventListener('submit', event => {
  event.preventDefault();
  if (guestForm.elements.checkOut.value <= guestForm.elements.checkIn.value) {
    message.textContent = 'Check-out must be after check-in.';
    return;
  }
  message.textContent = 'Design ready! Next step: connect this form to the booking API and database.';
});
