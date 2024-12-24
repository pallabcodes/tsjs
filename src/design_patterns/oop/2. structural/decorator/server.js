const express = require('express');

const app = express();

app.use(express.json());

// Custom decorator to wrap a route handler
function addCustomProperty(handler) {
  return (req, res, next) => {
    console.log(`platform: ${req.body.platform}`);
    req.customProperty = 'Hello, this is a custom property!';
    handler(req, res, next);
  };
}

// Using the decorator directly
app.post(
  '/protected',
  addCustomProperty((req, res) => {
    res.status(200).json({
      message: 'This is a protected route',
      customProperty: req.customProperty // Access custom property
    });
  })
);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'test' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
