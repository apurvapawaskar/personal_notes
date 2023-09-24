const mongoose = require('mongoose');

const password = process.env.MONGO_PASS || 'omQKzj1I04rRAqRp';
mongoose.connect(`mongodb+srv://tempUser:${password}@expensetracker.gffbecp.mongodb.net/Notes`).then(resp => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Could not connect to MongoDB', err);
});