import { Release } from "@prisma/client";
import { Strftime } from "./strftime";

export default function ReleaseList({ releases }) {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="text-left">Released</th>
          <th className="text-left">Version</th>
          <th className="text-left">Major</th>
          <th className="text-left">Minor</th>
          <th className="text-left">Patch</th>
          <th className="text-left">Prerelease</th>
          <th className="text-left">Suffix</th>
          <th className="text-left">sha</th>
        </tr>
      </thead>
      <tbody>
        {releases.map((r: Release) => (
          <tr key={r.id}>
            <td>
              <Strftime date={r.released} />
            </td>
            <td>{r.version}</td>
            <td>{r.major}</td>
            <td>{r.minor}</td>
            <td>{r.patch}</td>
            <td>{r.prerelease ? "Prerelease" : ""}</td>
            <td>{r.suffix}</td>
            <td>{r.sha}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
