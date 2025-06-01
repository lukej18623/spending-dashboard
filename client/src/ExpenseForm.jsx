import { useState } from "react";
import { addExpense } from "./apis/expenseApi";

export default function ExpenseForm() {
  // form to log an expense - need fields for all data (amount, category, date, notes)
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    const expense = { amount, category, date, notes };

    addExpense(expense)
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    setAmount("");
    setCategory("");
    setDate("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="amount"
        placeholder="enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        name="category"
        placeholder="enter category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="date"
        name="date"
        placeholder="enter date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="text"
        name="notes"
        placeholder="add any additional notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}
