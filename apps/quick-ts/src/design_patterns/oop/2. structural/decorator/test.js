const express = require('express');

const app = express();

app.use(express.json());

// Decorator function
function addCustomProperty(req, res, next) {
  console.info('platform: ', req.body.platform);
  req.customProperty = 'Hello, this is a custom property!';
  next(); // Call next to pass control to the next middleware
}

// Protected route using the decorator
app.post('/protected', addCustomProperty, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    customProperty: req.customProperty // Access the custom property added by the decorator
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'test' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
