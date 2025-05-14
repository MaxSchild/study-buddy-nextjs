const fs = require('fs');
const path = require('path');

// Read the universities data
const filePath = path.join(__dirname, '../new-frontend/app/private_data/world_universities_and_domains.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Add unique IDs to each university
const newData = data.map((uni, index) => ({
  ...uni,
  id: `uni-${index + 1}`
}));

// Write the modified data back to the file
fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

console.log('Successfully added unique IDs to universities data'); 