export function Table({ children }) {
  return (
    <div className="tableWrap">
      <table className="table">{children}</table>
    </div>
  );
}

export function Th({ children }) {
  return <th>{children}</th>;
}

export function Td({ children }) {
  return <td>{children}</td>;
}

