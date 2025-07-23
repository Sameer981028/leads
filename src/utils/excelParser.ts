import * as XLSX from 'xlsx';
import { Lead } from '../types';

export interface ExcelLeadData {
  Name: string;
  Email: string;
  Phone: string;
  Source: string;
  Campaign: string;
}

export const parseExcelFile = (file: File): Promise<Lead[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData: ExcelLeadData[] = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate and transform data - only require Name and Phone
        const leads: Lead[] = jsonData
          .filter(row => row.Name && row.Phone) // Only Name and Phone are required
          .map((row, index) => ({
            id: `excel-${Date.now()}-${index}`,
            name: String(row.Name || '').trim(),
            email: String(row.Email || '').trim().toLowerCase() || `lead${Date.now()}${index}@placeholder.com`,
            phone: String(row.Phone || '').trim(),
            source: String(row.Source || 'Excel Import').trim(),
            campaign: String(row.Campaign || 'Default Campaign').trim(),
            status: 'New' as const,
            dateAdded: new Date().toISOString()
          }));
        
        resolve(leads);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}. Please check the format.`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const generateExcelTemplate = () => {
  const templateData = [
    {
      Name: 'John Doe',
      Email: '',
      Phone: '+1234567890',
      Source: 'Meta Ads',
      Campaign: 'Summer Sale'
    },
    {
      Name: 'Jane Smith',
      Email: 'jane@example.com',
      Phone: '+1234567891',
      Source: 'Meta Ads',
      Campaign: ''
    },
    {
      Name: 'Bob Johnson',
      Email: '',
      Phone: '+1234567892',
      Source: 'Meta Ads',
      Campaign: ''
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Template');
  
  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Create blob and download
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads_template.xlsx';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportLeadsToExcel = (leads: Lead[], filename: string = 'leads_export') => {
  const exportData = leads.map(lead => ({
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    Source: lead.source,
    Campaign: lead.campaign,
    Status: lead.status,
    'Date Added': new Date(lead.dateAdded).toLocaleDateString(),
    'Last Response': lead.lastResponse ? new Date(lead.lastResponse).toLocaleDateString() : '',
    Remarks: lead.remarks || '',
    'Demo Type': lead.demoType || '',
    'Demo Start': lead.demoStartDate ? new Date(lead.demoStartDate).toLocaleDateString() : '',
    'Demo End': lead.demoEndDate ? new Date(lead.demoEndDate).toLocaleDateString() : '',
    'Integration Status': lead.integrationStatus || '',
    'Payment Status': lead.paymentStatus || '',
    'Payment Amount': lead.paymentAmount || '',
    'Payment Date': lead.paymentDate ? new Date(lead.paymentDate).toLocaleDateString() : '',
    Feedback: lead.feedback || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Export');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};