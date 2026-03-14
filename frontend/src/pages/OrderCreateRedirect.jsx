import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const OrderCreateRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/orders/create');
  }, [navigate]);

  return null;
};
