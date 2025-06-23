import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { isValidUrl, isValidShortcode, isValidValidity } from '../utils/validators';
import { logEvent } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const UrlForm = ({ onSubmit }) => {
  const [inputs, setInputs] = useState([{ longUrl: '', validity: '', shortcode: '' }]);

  const handleChange = (i, field, value) => {
    const updated = [...inputs];
    updated[i][field] = value;
    setInputs(updated);
  };

  const handleAdd = () => {
    if (inputs.length < 5) setInputs([...inputs, { longUrl: '', validity: '', shortcode: '' }]);
  };

  const handleSubmit = () => {
    const validated = inputs.map((entry, idx) => {
      const errors = [];
      if (!isValidUrl(entry.longUrl)) errors.push('Invalid URL');
      if (!isValidValidity(entry.validity)) errors.push('Invalid validity');
      if (entry.shortcode && !isValidShortcode(entry.shortcode)) errors.push('Invalid shortcode');

      if (errors.length > 0) {
        logEvent('error', 'Validation failed', { entry, errors });
        return { ...entry, errors };
      }

      const finalCode = entry.shortcode || uuidv4().slice(0, 6);
      const validMinutes = entry.validity ? parseInt(entry.validity) : 30;
      return { ...entry, shortcode: finalCode, validity: validMinutes, errors: [] };
    });

    onSubmit(validated.filter((v) => v.errors.length === 0));
  };

  return (
    <>
      {inputs.map((input, i) => (
        <Card key={i} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Long URL"
                  fullWidth
                  value={input.longUrl}
                  onChange={(e) => handleChange(i, 'longUrl', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Validity (minutes)"
                  fullWidth
                  value={input.validity}
                  onChange={(e) => handleChange(i, 'validity', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Custom Shortcode"
                  fullWidth
                  value={input.shortcode}
                  onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" onClick={handleAdd} disabled={inputs.length >= 5}>
        Add More URLs
      </Button>
      <Button variant="outlined" sx={{ ml: 2 }} onClick={handleSubmit}>
        Shorten URLs
      </Button>
    </>
  );
};

export default UrlForm;