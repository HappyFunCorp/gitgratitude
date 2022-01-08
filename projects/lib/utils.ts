export async function streamToBuffer(
  stream: NodeJS.ReadableStream
): Promise<Buffer> {
  const chunks: any[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

export function convertDate(d: Date): number | null {
  if (d) {
    return d.getTime() / 1000;
    // return strftime("%Y/%m/%d %H:%M", d);
    // return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()} ${d.getHours()}:${d.getMinutes()}`;
  }

  return null;
}
