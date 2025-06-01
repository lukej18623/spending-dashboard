import ExpenseForm from "./ExpenseForm";
import Header from "./Header";
import ExpenseList from "./ExpenseList";

export default function App() {
  return (
    <>
      <Header />
      <div className="container">
        <ExpenseForm />
        <ExpenseList />
      </div>
    </>
  );
}
