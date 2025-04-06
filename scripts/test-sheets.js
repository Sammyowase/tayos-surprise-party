// Test script for Google Sheets integration
require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function testGoogleSheets() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : '';
      
    console.log('Testing Google Sheets integration...');
    console.log('Sheet ID:', process.env.GOOGLE_SHEETS_ID);
    console.log('Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    
    // Using JWT directly
    const { JWT } = google.auth;
    const client = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    console.log('Created JWT client');
    
    const sheets = google.sheets({ version: 'v4', auth: client });
    console.log('Created sheets client');
    
    const testData = [['Test User', 'test@example.com', new Date().toISOString()]];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: testData,
      },
    });
    
    console.log('Success! Data added to sheet:', response.data);
  } catch (error) {
    console.error('Error testing Google Sheets integration:', error);
    
    if (error.message.includes('DECODER')) {
      console.error('\nThis is likely an issue with the private key format. Please check:');
      console.error('1. Make sure the key is properly formatted with \\n for newlines');
      console.error('2. Try setting NODE_OPTIONS=--openssl-legacy-provider');
      console.error('3. Check that the service account has edit access to the sheet');
    }
  }
}

testGoogleSheets(); 