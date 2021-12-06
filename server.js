const express = require('express');
const path = require('path');

const app = express();
require('dotenv').config();

const controller = require('./routes/logic');

const mongoose = require('mongoose');
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected.', process.env.MONGODB_URI);
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

connectDB();

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Define Routes
// app.use('/api/users', require('./routes/api/users'));
app.post('/api/buy', controller.buy);
app.post('/api/mint', controller.mint);
app.post('/api/nfts', controller.getNFTs);

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
// }



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
