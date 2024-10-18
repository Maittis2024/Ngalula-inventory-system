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
      let total;
      let reportTitle;
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const currentDate = new Date();
      const dayName = days[currentDate.getDay()];
      const monthName = months[currentDate.getMonth()];

      switch(type) {
        case 'daily':
          total = dailyTotal;
          reportTitle = `Daily Report - ${dayName}, ${currentDate.getDate()} ${monthName} ${currentDate.getFullYear()}`;
          break;
        case 'weekly':
          total = weeklyTotal;
          reportTitle = `Weekly Report - Week of ${dayName}, ${currentDate.getDate()} ${monthName} ${currentDate.getFullYear()}`;
          break;
        case 'monthly':
          total = monthlyTotal;
          reportTitle = `Monthly Report - ${monthName} ${currentDate.getFullYear()}`;
          break;
      }

      let clientDetails = '';
      clients.forEach((client, index) => {
        clientDetails += `
          <h4>Client ${index + 1}</h4>
          <p>Name: ${client.name}</p>
          <p>Email: ${client.email}</p>
          <p>Phone: ${client.phone}</p>
          <p>Payment Method: ${client.paymentMethod}</p>
          <p>Services: ${client.services.join(', ')}</p>
          <p>Therapist: ${client.therapist}</p>
          <p>Total: K${client.total}</p>
        `;
      });

      const report = `
        <h3>${reportTitle}</h3>
        <p>Spa Name: ${spaName}</p>
        <p>Total amount: K${total}</p>
        <p>Number of clients: ${clients.length}</p>
        <h3>Client Details:</h3>
        ${clientDetails}
      `;

      reportResult.innerHTML = report;

      // Generate PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text(spaName, 10, 10);
      doc.text(reportTitle, 10, 20);
      doc.text(`Total amount: K${total}`, 10, 30);
      doc.text(`Number of clients: ${clients.length}`, 10, 40);
      doc.text("Client Details:", 10, 50);
      
      let yPos = 60;
      clients.forEach((client, index) => {
        doc.text(`Client ${index + 1}:`, 10, yPos);
        yPos += 10;
        doc.text(`Name: ${client.name}`, 15, yPos);
        yPos += 10;
        doc.text(`Email: ${client.email}`, 15, yPos);
        yPos += 10;
        doc.text(`Phone: ${client.phone}`, 15, yPos);
        yPos += 10;
        doc.text(`Payment Method: ${client.paymentMethod}`, 15, yPos);
        yPos += 10;
        doc.text(`Services: ${client.services.join(', ')}`, 15, yPos);
        yPos += 10;
        doc.text(`Therapist: ${client.therapist}`, 15, yPos);
        yPos += 10;
        doc.text(`Total: K${client.total}`, 15, yPos);
        yPos += 20;
        
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });

      doc.save(`${type}_report.pdf`);
    }

    // Simple calculator
    const calculator = {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      multiply: (a, b) => a * b,
      divide: (a, b) => b !== 0 ? a / b : 'Cannot divide by zero'
    };

    // You can use the calculator in your code as needed, for example:
    // const result = calculator.add(100, 50);
    // console.log(result); // Outputs: 150