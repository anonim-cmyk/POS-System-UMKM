import api from "./http";

export const getInvoiceByOrderCode = (orderCode) =>
  api.get(`/api/invoices/order-code/${orderCode}`);
