import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services';
import { OrderForm } from '../components/OrderComponents';
import toast from 'react-hot-toast';

export const OrderCreationPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateOrder = async (orderData) => {
    try {
      setIsLoading(true);
      await orderService.createOrder(orderData);
      toast.success('Purchase Order created successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Create Purchase Order</h1>
      <OrderForm onSubmit={handleCreateOrder} isLoading={isLoading} />
    </div>
  );
};
