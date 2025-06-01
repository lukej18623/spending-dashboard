export async function addExpense(expense) {
  const response = await fetch("http://localhost:5080/expense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return response.text();
}

export async function getExpenses() {
  const response = await fetch("http://localhost:5080/expense");
  return response.json();
}
