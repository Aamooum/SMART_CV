import { useState } from "react";
import { Header } from "./components/ui.jsx";
import JobStep from "./steps/JobStep.jsx";
import ImportStep from "./steps/ImportStep.jsx";
import ResultsStep from "./steps/ResultsStep.jsx";

const EMPTY_JOB = { title: "", description: "", skills: [], experience: "2 ans", education: "Bac +3" };

export default function App() {
  const [step, setStep] = useState(1);
  const [job, setJob] = useState(EMPTY_JOB);
  const [saved, setSaved] = useState(false);
  const [files, setFiles] = useState([]);

  return (
    <>
      <Header step={step} />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {step === 1 && <JobStep job={job} saved={saved} onSave={(j) => { setJob(j); setSaved(true); setStep(2); }} />}
        {step === 2 && <ImportStep files={files} setFiles={setFiles} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && <ResultsStep job={job} files={files} onBack={() => setStep(2)} />}
      </main>
    </>
  );
}
