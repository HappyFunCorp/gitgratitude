import React from "react";
import Link from "next/link";

export default function Card({ href, title, description }) {
  return (
    <Link href={href}>
      <a className="block">
        <h2 className="font-bold text-lg pb-2">{title} &rarr;</h2>
        <p>{description}</p>
      </a>
    </Link>
  );
}
