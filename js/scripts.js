const clientForm = document.getElementById('clientForm');
const totalAmountDiv = document.getElementById('totalAmount');
const reportResult = document.getElementById('reportResult');
let dailyTotal = 0;
let weeklyTotal = 0;
let monthlyTotal = 0;
const clients = [];
const spaName = "Ngalula Beauty Spa";

clientForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const birthday = document.getElementById('birthday').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(input => ({
    name: input.value,
    price: parseFloat(input.dataset.price)
  }));
  const therapists = Array.from(document.querySelectorAll('input[name="therapists"]:checked')).map(input => input.value);

  const total = services.reduce((sum, service) => sum + service.price, 0);

  const client = {
    name,
    email,
    phone,
    birthday,
    paymentMethod,
    services,
    therapists,
    total,
    date: new Date()
  };

  clients.push(client);
  dailyTotal += total;
  weeklyTotal += total;
  monthlyTotal += total;

  totalAmountDiv.textContent = `Total for this client: ${total} ZMW`;

  clientForm.reset();
});

document.getElementById('dailyReport').addEventListener('click', () => generateReport('daily'));
document.getElementById('weeklyReport').addEventListener('click', () => generateReport('weekly'));
document.getElementById('monthlyReport').addEventListener('click', () => generateReport('monthly'));

function generateReport(type) {
  let total;
  let reportTitle;
  const date = new Date();
  const dayName = date.toLocaleString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleString('en-US', { month: 'long' });

  switch(type) {
    case 'daily':
      total = dailyTotal;
      reportTitle = `Daily Report - ${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
      break;
    case 'weekly':
      total = weeklyTotal;
      reportTitle = `Weekly Report - Week of ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
      break;
    case 'monthly':
      total = monthlyTotal;
      reportTitle = `Monthly Report - ${monthName} ${date.getFullYear()}`;
      break;
  }

  let clientDetails = '';
  clients.forEach((client, index) => {
    clientDetails += `
      <h4>Client ${index + 1}</h4>
      <p>Name: ${client.name}</p>
      <p>Email: ${client.email}</p>
      <p>Phone: ${client.phone}</p>
      <p>Birthday: ${client.birthday}</p>
      <p>Payment Method: ${client.paymentMethod}</p>
      <p>Services: ${client.services.map(s => s.name).join(', ')}</p>
      <p>Therapists: ${client.therapists.join(', ')}</p>
      <p>Total: ${client.total} ZMW</p>
      <hr>
    `;
  });

  const report = `
    <h3>${reportTitle}</h3>
    <h3>${spaName}</h3>
    <p>Total amount: ${total} ZMW</p>
    <p>Number of clients: ${clients.length}</p>
    <h4>Client Details:</h4>
    ${clientDetails}
  `;

  reportResult.innerHTML = report;
}

function addService() {
  const serviceName = prompt("Enter service name:");
  const servicePrice = prompt("Enter service price (in ZMW):");
  if (serviceName && servicePrice) {
    const servicesList = document.getElementById('servicesList');
    const newService = document.createElement('div');
    newService.className = 'service-item';
    newService.innerHTML = `
      <input type="checkbox" name="services" value="${serviceName}" data-price="${servicePrice}"> ${serviceName} (${servicePrice} ZMW)
      <button type="button" class="delete-btn" onclick="deleteService(this)">Delete</button>
    `;
    servicesList.appendChild(newService);
  }
}

function deleteService(button) {
  button.parentElement.remove();
}

function addTherapist() {
  const therapistName = prompt("Enter therapist name:");
  if (therapistName) {
    const therapistsList = document.getElementById('therapistsList');
    const newTherapist = document.createElement('div');
    newTherapist.className = 'therapist-item';
    newTherapist.innerHTML = `
      <input type="checkbox" name="therapists" value="${therapistName}"> ${therapistName}
      <button type="button" class="delete-btn" onclick="deleteTherapist(this)">Delete</button>
    `;
    therapistsList.appendChild(newTherapist);
  }
}

function deleteTherapist(button) {
  button.parentElement.remove();
}

const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : 'Cannot divide by zero'
};
