import { LockfileListDTO } from "lib/lockfiles";

type PageProps = { lockfiles?: LockfileListDTO[]; title?: string };

export default function LockfileList({ lockfiles, title }: PageProps) {
  return (
    <>
      <h2 className="text-3xl py-8 font-bold tracking-wide">
        Recent Lockfiles
      </h2>
      <table className="w-full">
        <tbody>
          <tr>
            <th>Eco</th>
            <th>Name</th>
            <th>Uploaded</th>
            <th>Valid</th>
            <th>Parsed</th>
            <th>Dependacies</th>
            <th>Processed</th>
          </tr>
          {lockfiles.map((l) => (
            <tr key={l.id}>
              <td>{l.ecosystem}</td>
              <td>
                <a href={`/lockfiles/${l.id}`} className="link-style">
                  {l.name}
                </a>
              </td>
              <td>{l.uploadedAt}</td>
              <td>{l.valid}</td>
              <td>{l.parsed}</td>
              <td>{l.dependacies}</td>
              <td>{l.processedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
