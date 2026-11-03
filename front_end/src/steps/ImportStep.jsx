import { useRef, useState } from "react";
import { Card, Button, PageTitle, Stepper, Pill } from "../components/ui.jsx";

const MAX = 5 * 1024 * 1024;
const size = (b) => `${(b / 1048576).toFixed(1).replace(".", ",")} Mo`;

export default function ImportStep({ files, setFiles, onBack, onNext }) {
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  const [errors, setErrors] = useState([]);

  const add = (list) => {
    const errs = [];
    const next = [...files];
    [...list].forEach((f) => {
      if (f.type !== "application/pdf") errs.push(`${f.name} : format non accepté (PDF uniquement).`);
      else if (f.size > MAX) errs.push(`${f.name} : dépasse 5 Mo.`);
      else if (next.some((x) => x.name === f.name && x.size === f.size)) errs.push(`${f.name} : déjà importé.`);
      else next.push(f);
    });
    setFiles(next);
    setErrors(errs);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Importer les CV" subtitle="Ajoutez un ou plusieurs CV PDF pour préparer l’analyse et le classement des candidatures." badge="Étape 2 sur 3" />
      <Stepper current={2} />
      <Card>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium">Importer un ou plusieurs CV PDF</h2>
            <p className="text-sm text-muted">Glissez-déposez vos fichiers ou utilisez le bouton ci-dessous.</p>
          </div>
          <Pill className="bg-brand-soft text-brand">PDF uniquement</Pill>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${over ? "border-brand bg-brand-soft" : "border-line bg-page/50"}`}
        >
          <p className="font-medium">Déposez vos CV ici</p>
          <p className="text-xs text-muted">Formats acceptés : PDF • Taille maximale par fichier : 5 Mo</p>
          <Button type="button" className="mt-3" onClick={() => ref.current.click()}>Parcourir les fichiers</Button>
          <input ref={ref} type="file" accept="application/pdf" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
        </div>

        {errors.length > 0 && (
          <ul role="alert" className="mt-4 space-y-1 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}

        <div className="mt-8">
          <div className="mb-3 flex justify-between text-sm">
            <h3 className="font-medium">Documents importés</h3>
            <span className="text-xs text-muted">{files.length} fichier{files.length > 1 ? "s" : ""} prêt{files.length > 1 ? "s" : ""} à l’analyse</span>
          </div>
          {files.length === 0 && <p className="rounded-lg border border-line p-4 text-sm text-muted">Aucun CV pour l’instant. Ajoutez au moins un fichier PDF.</p>}
          <ul className="space-y-3">
            {files.map((f) => (
              <li key={f.name + f.size} className="flex items-center gap-4 rounded-lg border border-line p-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-xs text-brand">PDF</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted">{size(f.size)} • Prêt à l’analyse</p>
                </div>
                <Pill className="bg-brand-soft text-brand">Prêt</Pill>
                <button className="text-xs text-muted hover:text-red-600" onClick={() => setFiles(files.filter((x) => x !== f))}>Retirer</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">Vous pouvez revenir à l’étape 1 pour modifier l’offre.<br />L’analyse sera lancée avec les CV ci-dessus.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onBack}>Retour</Button>
            <Button disabled={!files.length} onClick={onNext}>Continuer vers l’analyse →</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
