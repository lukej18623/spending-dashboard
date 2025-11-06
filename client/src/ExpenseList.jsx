import { getExpenses } from "./apis/expenseApi";
import { useEffect, useState } from "react";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses()
      .then((data) => setExpenses(data))
      .catch((error) => console.error(error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses yet. Add your first expense!</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="date-column">{formatDate(expense.date)}</td>
                <td className="category-column">{expense.category}</td>
                <td className="amount-column">{formatAmount(expense.amount)}</td>
                <td className="notes-column">{expense.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
