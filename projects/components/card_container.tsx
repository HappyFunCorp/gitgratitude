export default function CardContainer({ children }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">{children}</div>
  );
}
