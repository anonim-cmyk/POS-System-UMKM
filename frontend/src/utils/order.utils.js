export const TAX_RATE = 10;

export const calculateTax = (total) => (total * TAX_RATE) / 100;

export const buildOrderPayload = ({
  customer,
  cart,
  total,
  tableId,
  paymentMethod,
}) => {
  const tax = calculateTax(total);

  return {
    customerDetails: {
      name: customer.customerName,
      phone: customer.customerPhone,
      guests: customer.guests,
    },
    table: tableId,
    items: cart,
    bills: {
      total,
      tax,
      totalWithTax: total + tax,
    },
    paymentMethod,
  };
};
