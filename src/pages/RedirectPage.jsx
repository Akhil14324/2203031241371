import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logEvent } from '../utils/logger';

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem(shortcode);
    if (!data) {
      logEvent('error', 'Shortcode not found', { shortcode });
      alert('Invalid or expired link.');
      navigate('/');
      return;
    }

    const { longUrl, expiry } = JSON.parse(data);
    if (new Date() > new Date(expiry)) {
      logEvent('info', 'Link expired', { shortcode });
      alert('This link has expired.');
      localStorage.removeItem(shortcode);
      navigate('/');
    } else {
      logEvent('info', 'Redirecting to long URL', { shortcode, longUrl });
      window.location.href = longUrl;
    }
  }, [shortcode, navigate]);

  return null;
};

export default RedirectPage;