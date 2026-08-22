export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400);
    // This will be caught by our global error handler
    throw new Error(error.details[0].message); 
  }
  
  next();
};
