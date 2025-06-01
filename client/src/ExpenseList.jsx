import { getExpenses } from "./apis/expenseApi";
import { useEffect, useState } from "react";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getExpenses()
      .then((data) => setExpenses(data))
      .catch((error) => console.error(error));
  }, []);

  const listItems = expenses.map((e) => (
    <li key={e.id}>
      {e.amount} - {e.category} - {e.date} - {e.notes}
    </li>
  ));

  return <ul className="expense-list">{listItems}</ul>;
}
