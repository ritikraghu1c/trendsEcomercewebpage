import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';
import displayINRCurrency from '../helpers/displayCurrency';

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(SummaryApi.getAllOrders.url, {
        method: SummaryApi.getAllOrders.method,
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setAllOrders(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Error fetching orders');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="bg-white p-4">
      <h2 className="text-2xl font-semibold mb-6">All Orders</h2>

      {allOrders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {allOrders.map((order, index) => (
            <div
              key={order._id}
              className="border p-4 rounded shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <p className="font-semibold">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Ordered on: {moment(order.createdAt).format('LLL')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {displayINRCurrency(order.totalPrice)}
                  </p>
                  <p className="text-sm">Status: {order.status}</p>
                  <p className="text-sm">Payment: {order.payment?.method || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {order.cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex border p-2 rounded gap-4 items-center"
                  >
                    <img
                      src={item.product?.productImage?.[0]}
                      alt={item.product?.productName}
                      className="w-20 h-20 object-contain rounded"
                      onError={(e) => (e.target.src = '/no-image.png')}
                    />
                    <div>
                      <p className="font-semibold">{item.product?.productName}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-700">
                        Price: {displayINRCurrency(item.product?.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
