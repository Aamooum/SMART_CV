import { useEffect, useState } from "react";
import { Card, Button, PageTitle, Stepper, Pill } from "../components/ui.jsx";
import { analyzeCvs, rankingToCsv } from "../lib/scoring.js";

export default function ResultsStep({ job, files, onBack }) {
  const [candidates, setCandidates] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    analyzeCvs(job, files).then((r) => live && setCandidates(r)).catch((e) => live && setError(e.message));
    return () => { live = false; };
  }, [job, files]);

  const download = () => {
    const blob = new Blob([rankingToCsv(job, candidates)], { type: "text/csv;charset=utf-8" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "classement.csv" });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Analyser et comparer" subtitle={`Comparez les CV importés au regard du poste ${job.title} et des compétences ${job.skills.join(", ")}.`} badge="Étape 3 sur 3" />
      <Stepper current={3} />
      <Card>
        <h2 className="text-lg font-medium">Analyse et comparaison des CV</h2>
        <p className="mb-5 text-sm text-muted">Les candidats ci-dessous ont un score de compatibilité ≥ 50 % avec le poste {job.title}.</p>

        <div className="rounded-xl bg-page p-5">
          <p className="text-xs text-muted">Offre de référence</p>
          <p className="mt-1 text-xl font-medium">{job.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.map((s) => <span key={s} className="rounded-md bg-brand-soft px-2.5 py-1 text-xs text-brand">{s}</span>)}
          </div>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-muted">Expérience requise</dt><dd className="font-medium">{job.experience}</dd></div>
            <div><dt className="text-xs text-muted">Niveau d’études</dt><dd className="font-medium">{job.education}</dd></div>
          </dl>
        </div>

        <div className="mt-8 mb-3 flex justify-between text-sm">
          <h3 className="font-medium">Classement des candidats</h3>
          <span className="text-xs text-muted">Score ≥ 50 %</span>
        </div>

        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}. Vérifiez la connexion au serveur puis réessayez.</p>}
        {!candidates && !error && <p className="rounded-lg border border-line p-4 text-sm text-muted">Analyse en cours…</p>}
        {candidates?.length === 0 && <p className="rounded-lg border border-line p-4 text-sm text-muted">Aucun candidat n’atteint 50 %. Modifiez l’offre ou importez d’autres CV.</p>}

        <ol className="space-y-3">
          {candidates?.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 rounded-lg border border-line bg-page/50 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-medium text-brand">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted">{c.headline} • {c.years} an{c.years > 1 ? "s" : ""} d’expérience</p>
              </div>
              <Pill className="border-green-200 bg-green-50 font-medium text-green-700">{c.score} %</Pill>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">Vous pouvez revenir à l’étape 2 pour ajouter ou modifier des CV.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onBack}>Retour à l’import</Button>
            <Button disabled={!candidates?.length} onClick={download}>Télécharger le classement →</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
