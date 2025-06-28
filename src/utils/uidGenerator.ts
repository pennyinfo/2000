// src/utils/uidGenerator.ts

// ✅ Named export: use generateUID in your imports
export const generateUID = (whatsappNumber: string, fullName: string): string => {
  const firstLetter = fullName.charAt(0).toUpperCase();
  return `ESE${whatsappNumber}${firstLetter}`;
};

// Validates Indian mobile numbers (10 digits, starts with 6-9)
export const validateWhatsappNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(cleanNumber);
};

// Cleans up address formatting
export const formatAddress = (address: string): string => {
  return address.trim().replace(/\s+/g, ' ');
};

// Check for duplicates based on WhatsApp number
export const checkDuplicateWhatsapp = async (whatsappNumber: string): Promise<boolean> => {
  const existingRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
  return existingRegistrations.some((reg: any) => reg.whatsappNumber === whatsappNumber);
};

// Save a registration entry to localStorage
export const saveRegistration = (registrationData: any): void => {
  const existingRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
  const newRegistration = {
    ...registrationData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'Pending'
  };
  existingRegistrations.push(newRegistration);
  localStorage.setItem('registrations', JSON.stringify(existingRegistrations));
};

// Retrieve all registrations
export const getRegistrations = (): any[] => {
  return JSON.parse(localStorage.getItem('registrations') || '[]');
};

// Update the status of a registration
export const updateRegistrationStatus = (id: string, status: 'Approved' | 'Pending' | 'Rejected'): void => {
  const registrations = getRegistrations();
  const updated = registrations.map(reg =>
    reg.id === id ? { ...reg, status, updatedAt: new Date().toISOString() } : reg
  );
  localStorage.setItem('registrations', JSON.stringify(updated));
};

// Delete a registration by ID
export const deleteRegistration = (id: string): void => {
  const registrations = getRegistrations();
  const filtered = registrations.filter(reg => reg.id !== id);
  localStorage.setItem('registrations', JSON.stringify(filtered));
};

// Export registration data to CSV
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export registration data to PDF (simplified print version)
export const exportToPDF = async (data: any[], filename: string): Promise<void> => {
  const printContent = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Registration Data Export</h1>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => 
              `<tr>${Object.values(row).map(val => `<td>${val}</td>`).join('')}</tr>`
            ).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};
