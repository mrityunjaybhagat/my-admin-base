import DefaultForm from "../components/forms/DefaultForm";
import ProductForm from "../pages/Products/ProductForm";
import CustomerForm from "../pages/Customers/CustomerForm";
import SupplierForm from "../pages/Suppliers/SupplierForm";
import InvoiceFrom from "../pages/Invoices/InvoiceForm";
import ExpenseForm from "../pages/Expenses/ExpenseForm";
import CashVoucherForm from "../pages/CashVouchers/CashVoucherForm";
import PurchaseForm from "../pages/Purchases/PurchaseForm";
import StockAdjustmentForm from "../pages/Stock/StockAdjustmentForm";
import PaymentForm from "../pages/Payments/PaymentForm"; // Temporary import for PaymentsForm, replace with actual path when available


// import PaymentsForm from "./PaymentsForm";

const formMap = {
  products: ProductForm,
  customers: CustomerForm,
  suppliers: SupplierForm,
  invoices: InvoiceFrom,
  expenses: ExpenseForm,
  "cash-vouchers": CashVoucherForm,
  purchases: PurchaseForm,
  "stock-adjustments": StockAdjustmentForm,
  payments: PaymentForm, // Temporary mapping for payments, replace with PaymentForm when available

  // payments: PaymentsForm,
};

export const getFormComponent = (module) => {
  return formMap[module] || DefaultForm;
};

export default formMap;