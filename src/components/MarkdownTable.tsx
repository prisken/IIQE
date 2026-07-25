function parseMarkdownTable(md: string): string[][] {
  return md
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"))
    .filter((l) => !/^\|\s*:?-{3,}/.test(l))
    .map((l) =>
      l
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim()),
    );
}

export function MarkdownTable({ markdown }: { markdown: string }) {
  const rows = parseMarkdownTable(markdown);
  if (!rows.length) return null;
  const [head, ...body] = rows;
  return (
    <table>
      <thead>
        <tr>
          {head.map((c, i) => (
            <th key={i}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, ri) => (
          <tr key={ri}>
            {row.map((c, ci) => (
              <td key={ci}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
