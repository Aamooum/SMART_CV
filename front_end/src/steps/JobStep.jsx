import { useState } from "react";
import { Card, Button, PageTitle, Stepper } from "../components/ui.jsx";

const EXPERIENCES = ["Débutant", "1 an", "2 ans", "3 ans", "5 ans", "8 ans et plus"];
const LEVELS = ["Bac", "Bac +2", "Bac +3", "Bac +5", "Doctorat"];

const Field = ({ label, error, hint, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium">{label} <span className="text-brand">*</span></span>
    {children}
    {error ? <span className="mt-2 block text-xs text-red-600">{error}</span> : hint && <span className="mt-2 block text-xs text-muted">{hint}</span>}
  </label>
);

const input = "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export default function JobStep({ job, saved, onSave }) {
  const [form, setForm] = useState(job);
  const [draft, setDraft] = useState("");
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addSkills = (raw) => {
    const items = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!items.length) return;
    set("skills", [...new Set([...form.skills, ...items])]);
    setDraft("");
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "Indiquez le titre du poste.";
    if (!form.description.trim()) errs.description = "Ajoutez une description du poste.";
    if (!form.skills.length) errs.skills = "Ajoutez au moins une compétence.";
    setErrors(errs);
    if (!Object.keys(errs).length) onSave(form);
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Créez votre offre d’emploi" subtitle="Définissez le profil recherché pour comparer vos CV sur une base pertinente." badge={saved ? "Enregistrée" : "Non enregistrée"} />
      <Stepper current={1} />
      <Card>
        <form onSubmit={submit} className="space-y-6" noValidate>
          <div className="flex items-start justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-lg font-medium">Les informations du poste</h2>
              <p className="text-sm text-muted">Précisez vos besoins, nous préparons la suite.</p>
            </div>
            <span className="text-xs text-muted"><span className="text-brand">*</span> Champs obligatoires</span>
          </div>

          <Field label="Titre du poste" error={errors.title}>
            <input className={input} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <Field label="Description du poste" error={errors.description} hint="Une description précise permet une comparaison plus pertinente avec les CV.">
            <textarea rows={4} className={input} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <Field label="Compétences recherchées" error={errors.skills} hint="Séparez les compétences par une virgule ou appuyez sur Entrée.">
            <div className={`${input} flex flex-wrap items-center gap-2 py-2`}>
              {form.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-md bg-brand-soft px-2.5 py-1 text-xs text-brand">
                  {s}
                  <button type="button" aria-label={`Retirer ${s}`} onClick={() => set("skills", form.skills.filter((x) => x !== s))}>×</button>
                </span>
              ))}
              <input
                className="min-w-24 flex-1 bg-transparent py-1 outline-none"
                placeholder="Ajouter…"
                value={draft}
                onChange={(e) => (e.target.value.endsWith(",") ? addSkills(e.target.value) : setDraft(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addSkills(draft); }
                  if (e.key === "Backspace" && !draft) set("skills", form.skills.slice(0, -1));
                }}
                onBlur={() => addSkills(draft)}
              />
            </div>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Expérience requise">
              <select className={input} value={form.experience} onChange={(e) => set("experience", e.target.value)}>
                {EXPERIENCES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Niveau d’études">
              <select className={input} value={form.education} onChange={(e) => set("education", e.target.value)}>
                {LEVELS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">Votre offre reste dans votre espace.<br />Elle n’est pas publiée en ligne.</p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => { setForm(job); setErrors({}); }}>Annuler</Button>
              <Button type="submit">Enregistrer l’offre →</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
