import { Lockfile } from "@prisma/client";

type PageProps = { lockfiles?: Lockfile[]; title?: string };

export default function LockfileList({ lockfiles, title }: PageProps) {
  console.log(lockfiles);
  return (
    <>
      <h2 className="text-3xl py-8 font-bold tracking-wide">
        Recent Lockfiles
      </h2>
      <table className="w-full">
        <tbody>
          <tr>
            <th className="text-left">Eco</th>
            <th className="text-left">Name</th>
            <th className="text-left">Uploaded</th>
            <th className="text-left">Valid</th>
            <th className="text-left">Parsed</th>
            <th className="text-left">Dependacies</th>
            <th className="text-left">Processed</th>
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
              <td>{l.valid ? "Yes" : "No"}</td>
              <td>{l.parsed ? "Yes" : "No"}</td>
              <td>
                {
                  // @ts-expect-error
                  l._count.Dependancy
                }
              </td>
              <td>{l.processedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
