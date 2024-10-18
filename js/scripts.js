const clientForm = document.getElementById('clientForm');
const totalAmountDiv = document.getElementById('totalAmount');
const reportResult = document.getElementById('reportResult');
const servicesList = document.getElementById('servicesList');
const therapistList = document.getElementById('therapistList');
let dailyTotal = 0;
let weeklyTotal = 0;
let monthlyTotal = 0;
const clients = [];
const spaName = "Ngalula Beauty Spa";

let servicePrices = {
  massage: 500,
  facial: 400,
  manicure: 300,
  pedicure: 350
};

let therapists = ['John', 'Sarah', 'Emma'];

function updateServicesList() {
  servicesList.innerHTML = '';
  Object.entries(servicePrices).forEach(([service, price]) => {
    const div = document.createElement('div');
    div.className = 'service-item';
    div.innerHTML = `
      <label>
        <input type="checkbox" value="${service}"> ${service} (K${price})
      </label>
      <button type="button" class="delete-btn" onclick="deleteService('${service}')">Delete</button>
    `;
    servicesList.appendChild(div);
  });
}

function updateTherapistList() {
  therapistList.innerHTML = '';
  therapists.forEach(therapist => {
    const div = document.createElement('div');
    div.className = 'therapist-item';
    div.innerHTML = `
      <label>
        <input type="radio" name="therapist" value="${therapist}"> ${therapist}
      </label>
      <button type="button" class="delete-btn" onclick="deleteTherapist('${therapist}')">Delete</button>
    `;
    therapistList.appendChild(div);
  });
}

function deleteService(service) {
  delete servicePrices[service];
  updateServicesList();
}

function deleteTherapist(therapist) {
  therapists = therapists.filter(t => t !== therapist);
  updateTherapistList();
}

document.getElementById('addService').addEventListener('click', function() {
  const newService = document.getElementById('newService').value;
  const newServicePrice = document.getElementById('newServicePrice').value;
  if (newService && newServicePrice) {
    servicePrices[newService] = parseInt(newServicePrice);
    updateServicesList();
    document.getElementById('newService').value = '';
    document.getElementById('newServicePrice').value = '';
  }
});

document.getElementById('addTherapist').addEventListener('click', function() {
  const newTherapist = document.getElementById('newTherapist').value;
  if (newTherapist) {
    therapists.push(newTherapist);
    updateTherapistList();
    document.getElementById('newTherapist').value = '';
  }
});

updateServicesList();
updateTherapistList();

clientForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const paymentMethod = document.getElementById('paymentMethod').value;
  const services = Object.keys(servicePrices).filter(service => 
    document.querySelector(`input[type="checkbox"][value="${service}"]:checked`)
  );
  const therapistElement = document.querySelector('#therapistList input[type="radio"]:checked');
  const therapist = therapistElement ? therapistElement.value : 'Not specified';

  const total = services.reduce((sum, service) => sum + servicePrices[service], 0);

  const client = {
    name,
    email,
    phone,
    paymentMethod,
    services,
    therapist,
    total,
    date: new Date()
  };

  clients.push(client);
  dailyTotal += total;
  weeklyTotal += total;
  monthlyTotal += total;

  totalAmountDiv.textContent = `Total for this client: K${total}`;

  clientForm.reset();
  updateServicesList();
  updateTherapistList();
});

document.getElementById('dailyReport').addEventListener('click', () => generateReport('daily'));
document.getElementById('weeklyReport').addEventListener('click', () => generateReport('weekly'));
document.getElementById('monthlyReport').addEventListener('click', () => generateReport('monthly'));

function generateReport(type) {
  let total = 0;
  let reportTitle = '';
  switch(type) {
    case 'daily':
      total = dailyTotal;
      reportTitle = 'Daily Financial Report';
      break;
    case 'weekly':
      total = weeklyTotal;
      reportTitle = 'Weekly Financial Report';
      break;
    case 'monthly':
      total = monthlyTotal;
      reportTitle = 'Monthly Financial Report';
      break;
  }

  const doc = new window.jspdf.jsPDF();
  doc.text(spaName, 10, 10);
  doc.text(reportTitle, 10, 20);
  doc.text(`Total: K${total}`, 10, 30);
  doc.save(`${spaName}_${reportTitle}.pdf`);

  reportResult.textContent = `${reportTitle}: K${total}`;
}