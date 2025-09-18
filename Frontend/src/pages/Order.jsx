import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(SummaryApi.getUserOrders.url, {
        method: SummaryApi.getUserOrders.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDelete = async (orderId) => {
    // ✅ SweetAlert2 confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    });

    if (!result.isConfirmed) return;

    try {
      const { url, method } = SummaryApi.deleteOrder(orderId);
      const res = await fetch(url, { method, credentials: 'include' });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchOrders(); // refresh list
      } else {
        toast.error(data.message || "Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded shadow-md mb-6 bg-white overflow-hidden">
            <div
              className="flex flex-col md:flex-row cursor-pointer border-b border-gray-200 p-4 gap-4"
              onClick={() => toggleExpand(order._id)}
            >
              {/* Left side: Items */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:flex md:flex-col md:min-w-[300px]">
                {(order.cartItems || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center border rounded p-2 bg-gray-50"
                  >
                    <img
                      src={item?.product?.productImage?.[0] || '/placeholder.png'}
                      alt={item?.product?.productName || item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                    />
                    <p className="text-center text-xs sm:text-sm font-semibold mt-2 truncate max-w-[120px]">
                      {item?.product?.productName || item.name}
                    </p>
                    <p className="text-xs text-gray-600">Qty: {item.qty}</p>
                  </div>
                ))}
              </div>

              {/* Right side: Payment & order summary */}
              <div
                className={`flex-1 border-l border-gray-200 p-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedOrderId === order._id
                    ? 'max-h-[2000px] opacity-100'
                    : 'max-h-0 opacity-0 hidden md:block md:max-h-[2000px] md:opacity-100'
                }`}
                aria-hidden={expandedOrderId !== order._id}
              >
                <p><strong>Status:</strong> {order.status || 'N/A'}</p>
                <p><strong>Total:</strong> {displayINRCurrency(order.totalPrice || 0)}</p>
                <p><strong>Payment ID:</strong> {order?.payment?.razorpay_payment_id || 'N/A'}</p>
                <p><strong>Order ID:</strong> {order?.payment?.razorpay_order_id || 'N/A'}</p>
                <p><strong>Payment Method:</strong> {order?.payment?.method || 'N/A'}</p>

                <p className="mt-4 font-semibold">Items Details:</p>
                <ul className="ml-4 list-disc">
                  {(order.cartItems || []).map((item, index) => (
                    <li key={index} className="mb-1">
                      {item?.product?.productName || item.name} × {item.qty} — {displayINRCurrency(item.price)}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleDelete(order._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
