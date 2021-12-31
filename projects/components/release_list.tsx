export default function ReleaseList({ releases }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Version</th>
          <th>Released</th>
          <th>sha</th>
        </tr>
      </thead>
      <tbody>
        {releases.map((r) => (
          <tr key={r}>
            <td>{r.version}</td>
            <td>{r.released}</td>
            <td>{r.sha}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
