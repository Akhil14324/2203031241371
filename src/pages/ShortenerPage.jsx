import React, { useState } from 'react';
import UrlForm from '../components/UrlForm';
import { Typography, Container, Box, Link } from '@mui/material';
import { logEvent } from '../utils/logger';

const ShortenerPage = () => {
  const [results, setResults] = useState([]);

  const handleShorten = (entries) => {
    const generated = entries.map((entry) => {
      const expiry = new Date(Date.now() + entry.validity * 60000).toLocaleString();
      logEvent('info', 'Shortened URL created', { entry });

      // Save mapping to localStorage
      localStorage.setItem(entry.shortcode, JSON.stringify({
        longUrl: entry.longUrl,
        expiry: new Date(Date.now() + entry.validity * 60000),
      }));

      return {
        ...entry,
        shortUrl:" http://localhost:3000/${entry.shortcode}",
        expiry,
      };
    });
    setResults(generated);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <UrlForm onSubmit={handleShorten} />
      <Box mt={4}>
        {results.map((r, idx) => (
          <Box key={idx} mb={2}>
            <Typography><strong>Original:</strong> {r.longUrl}</Typography>
            <Typography>
              <strong>Short:</strong>{' '}
              <Link href={r.shortUrl} target="_blank">{r.shortUrl}</Link>
            </Typography>
            <Typography><strong>Expires at:</strong> {r.expiry}</Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ShortenerPage;