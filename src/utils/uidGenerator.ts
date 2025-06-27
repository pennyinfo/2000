
// Utility functions for generating UIDs and managing registration data

export const generateUID = (whatsappNumber: string, fullName: string): string => {
  const firstLetter = fullName.charAt(0).toUpperCase();
  return `ESE${whatsappNumber}${firstLetter}`;
};

export const validateWhatsappNumber = (number: string): boolean => {
  // Remove any non-digit characters
  const cleanNumber = number.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number (10 digits starting with 6-9)
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  return indianMobileRegex.test(cleanNumber);
};

export const formatAddress = (address: string): string => {
  return address.trim().replace(/\s+/g, ' ');
};

export const checkDuplicateWhatsapp = async (whatsappNumber: string): Promise<boolean> => {
  // In a real application, this would check the database
  // For now, we'll simulate with localStorage or return false
  const existingRegistrations = JSON.parse(localStorage.getItem('registrations') || '[]');
  return existingRegistrations.some((reg: any) => reg.whatsappNumber === whatsappNumber);
};

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

export const getRegistrations = (): any[] => {
  return JSON.parse(localStorage.getItem('registrations') || '[]');
};

export const updateRegistrationStatus = (id: string, status: 'Approved' | 'Pending' | 'Rejected'): void => {
  const registrations = getRegistrations();
  const updatedRegistrations = registrations.map(reg => 
    reg.id === id ? { ...reg, status, updatedAt: new Date().toISOString() } : reg
  );
  localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
};

export const deleteRegistration = (id: string): void => {
  const registrations = getRegistrations();
  const filteredRegistrations = registrations.filter(reg => reg.id !== id);
  localStorage.setItem('registrations', JSON.stringify(filteredRegistrations));
};

// Export data functions
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data: any[], filename: string): Promise<void> => {
  // This would require a PDF library like jsPDF
  // For now, we'll create a simple HTML print version
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
              `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`
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
