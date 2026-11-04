// Mock du backend. Remplacez analyzeCvs() par un appel à votre API (voir VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL;

export const nameFromFile = (file) =>
  file.name
    .replace(/\.pdf$/i, "")
    .replace(/^cv[_\-\s]*/i, "")
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ") || file.name;

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export async function analyzeCvs(job, files) {
  if (API_URL) {
    const body = new FormData();
    body.append("job", JSON.stringify(job));
    files.forEach((f) => body.append("cvs", f));
    const res = await fetch(`${API_URL}/analyze`, { method: "POST", body });
    if (!res.ok) throw new Error("Échec de l’analyse");
    return res.json(); // [{ id, name, headline, years, score }]
  }
  await new Promise((r) => setTimeout(r, 1200));
  return files
    .map((f) => {
      const h = hash(f.name);
      return { id: f.name, name: nameFromFile(f), headline: "Développeur·se", years: 1 + (h % 6), score: 40 + (h % 56) };
    })
    .filter((c) => c.score >= 50)
    .sort((a, b) => b.score - a.score);
}

export function rankingToCsv(job, candidates) {
  const rows = [["Rang", "Candidat", "Expérience (ans)", "Score (%)"]];
  candidates.forEach((c, i) => rows.push([i + 1, c.name, c.years, c.score]));
  return `# ${job.title}\n` + rows.map((r) => r.join(";")).join("\n");
}
