import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { resumesApi } from '../api/resumes.ts';
import { promptsApi } from '../api/prompts.ts';
import { applicationsApi } from '../api/applications.ts';
import { tailoredApi } from '../api/tailored.ts';
import type { ResumeDocument, PromptTemplate, JobApplication, TailoredResume, TailoringRequest, OpenAiModel } from '../types/index.ts';
import { OPENAI_MODEL_DEFAULT } from '../types/index.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

type Tab = 'resume' | 'summary' | 'gaps';

const MODEL_OPTIONS: { label: string; value: OpenAiModel; description: string }[] = [
  { label: 'Fast & Cheap',      value: 'gpt-4o-mini',  description: 'Quickest results, lower cost' },
  { label: 'Balanced Quality',  value: 'gpt-4.1-mini', description: 'Best balance of quality and speed' },
  { label: 'High Quality',      value: 'gpt-4.1',      description: 'Most accurate, slower and pricier' },
];

export default function ResumeTailoring() {
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [history, setHistory] = useState<TailoredResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [masterResumeId, setMasterResumeId] = useState<number | ''>('');
  const [promptTemplateId, setPromptTemplateId] = useState<number | ''>('');
  const [jobApplicationId, setJobApplicationId] = useState<number | ''>('');
  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<TailoredResume | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('resume');
  const [selectedModel, setSelectedModel] = useState<OpenAiModel>(OPENAI_MODEL_DEFAULT);

  // File upload
  const [uploadMode, setUploadMode] = useState<'select' | 'upload' | 'paste'>('select');
  const [uploadName, setUploadName] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<ResumeDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([resumesApi.getAll(), promptsApi.getAll(), applicationsApi.getAll(), tailoredApi.getAll()])
      .then(([r, p, a, h]) => {
        setResumes(r);
        setPrompts(p);
        setApplications(a);
        setHistory(h);
        const def = p.find((pt) => pt.isDefault);
        if (def) setPromptTemplateId(def.id);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async () => {
    if (!uploadName.trim()) { alert('Please enter a name for this resume'); return; }
    setUploading(true);
    try {
      let doc: ResumeDocument;
      if (uploadMode === 'upload' && uploadFile) {
        doc = await resumesApi.uploadFile(uploadFile, uploadName, true);
      } else if (uploadMode === 'paste') {
        doc = await resumesApi.saveText({ name: uploadName, contentText: pasteText, isMaster: true });
      } else {
        return;
      }
      setUploadedResume(doc);
      setMasterResumeId(doc.id);
      setResumes((prev) => [...prev, doc]);
      setUploadMode('select');
    } catch (e: unknown) { alert((e as Error).message); }
    finally { setUploading(false); }
  };

  const handleGenerate = async () => {
    const resumeId = masterResumeId || uploadedResume?.id;
    if (!resumeId || !promptTemplateId) {
      alert('Please select a master resume and a prompt template');
      return;
    }
    if (!jobApplicationId && !jobDescription.trim()) {
      alert('Please select a job application or paste a job description');
      return;
    }
    setGenerating(true);
    setResult(null);
    setError(null);
    const payload: TailoringRequest = {
      masterResumeId: Number(resumeId),
      promptTemplateId: Number(promptTemplateId),
      jobApplicationId: jobApplicationId ? Number(jobApplicationId) : undefined,
      jobDescription: jobDescription.trim() || undefined,
      model: selectedModel,
    };
    try {
      const res = await tailoredApi.generate(payload);
      setResult(res);
      setActiveTab('resume');
      loadData();
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setGenerating(false); }
  };

  const copyToClipboard = (text?: string) => {
    if (text) navigator.clipboard.writeText(text);
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Resume Tailoring</h1>
          <p className="page-subtitle">Generate a tailored resume using AI — no fabrication, only your facts</p>
        </div>
      </div>

      {error && <div className="error-banner" style={{ marginBottom: 16 }}>⚠️ {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>
        {/* Input Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Master Resume */}
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>1. Master Resume</h3>
            <div className="filter-bar" style={{ marginBottom: 12 }}>
              <button className={`filter-btn${uploadMode === 'select' ? ' active' : ''}`} onClick={() => setUploadMode('select')}>Select Existing</button>
              <button className={`filter-btn${uploadMode === 'upload' ? ' active' : ''}`} onClick={() => setUploadMode('upload')}>Upload File</button>
              <button className={`filter-btn${uploadMode === 'paste' ? ' active' : ''}`} onClick={() => setUploadMode('paste')}>Paste Text</button>
            </div>

            {uploadMode === 'select' && (
              <select value={masterResumeId} onChange={(e) => setMasterResumeId(e.target.value ? Number(e.target.value) : '')} style={{ width: '100%' }}>
                <option value="">— Select a resume —</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}{r.isMaster ? ' ⭐' : ''}</option>
                ))}
              </select>
            )}

            {(uploadMode === 'upload' || uploadMode === 'paste') && (
              <div className="form-grid single" style={{ gap: 12 }}>
                <div className="form-group">
                  <label>Resume Name</label>
                  <input value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="e.g. My Master Resume 2025" />
                </div>
                {uploadMode === 'upload' && (
                  <div className="form-group">
                    <label>File (PDF, DOCX, TXT)</label>
                    <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                      {uploadFile ? <span style={{ color: 'var(--success)' }}>✓ {uploadFile.name}</span> : <span style={{ color: 'var(--text-muted)' }}>Click to select file</span>}
                    </div>
                    <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md" style={{ display: 'none' }} onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
                  </div>
                )}
                {uploadMode === 'paste' && (
                  <div className="form-group">
                    <label>Resume Content</label>
                    <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} rows={8} placeholder="Paste your resume text here..." />
                  </div>
                )}
                <button className="btn btn-secondary" onClick={handleUpload} disabled={uploading}>
                  {uploading ? <span className="loading-spinner" style={{ width: 14, height: 14 }} /> : '⬆️'}
                  {uploading ? 'Uploading...' : 'Save & Use This Resume'}
                </button>
              </div>
            )}

            {uploadedResume && (
              <div className="success-banner" style={{ marginTop: 8 }}>
                ✓ Resume "{uploadedResume.name}" saved. Selected automatically.
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>2. Job Description</h3>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>Link to Application (optional)</label>
              <select value={jobApplicationId} onChange={(e) => setJobApplicationId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">— None — (paste below)</option>
                {applications.filter((a) => a.jobDescription).map((a) => (
                  <option key={a.id} value={a.id}>{a.jobTitle}{a.companyName ? ` @ ${a.companyName}` : ''}</option>
                ))}
              </select>
            </div>
            {!jobApplicationId && (
              <div className="form-group">
                <label>Paste Job Description</label>
                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={8} placeholder="Paste the full job description here..." />
              </div>
            )}
          </div>

          {/* Prompt */}
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>3. Prompt Template</h3>
            <select value={promptTemplateId} onChange={(e) => setPromptTemplateId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">— Select prompt —</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>{p.name}{p.isDefault ? ' ⭐ Default' : ''}</option>
              ))}
            </select>
          </div>

          {/* Model Selection */}
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>4. AI Model</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MODEL_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1px solid ${selectedModel === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                    background: selectedModel === opt.value ? 'var(--primary-subtle, rgba(99,102,241,0.08))' : 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <input
                    type="radio"
                    name="openai-model"
                    value={opt.value}
                    checked={selectedModel === opt.value}
                    onChange={() => setSelectedModel(opt.value)}
                    style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                  />
                  <span>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>{opt.label}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{opt.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="btn-generate-resume"
            className="btn btn-primary"
            style={{ padding: '14px', fontSize: '1rem', justifyContent: 'center' }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <>
                <span className="loading-spinner" style={{ width: 18, height: 18 }} />
                Generating with AI…
              </>
            ) : '✨ Generate Tailored Resume'}
          </button>

          {generating && (
            <div className="info-banner">
              🤖 AI is tailoring your resume. This may take 30–60 seconds…
            </div>
          )}
        </div>

        {/* Result Panel */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3>Generated Result</h3>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyToClipboard(
                    activeTab === 'resume' ? result.generatedContent
                    : activeTab === 'summary' ? result.changeSummary
                    : result.gapsOrWarnings
                  )}
                >
                  📋 Copy
                </button>
              </div>

              <div className="tabs" style={{ padding: '0 20px', margin: 0 }}>
                <button className={`tab${activeTab === 'resume' ? ' active' : ''}`} onClick={() => setActiveTab('resume')}>Tailored Resume</button>
                <button className={`tab${activeTab === 'summary' ? ' active' : ''}`} onClick={() => setActiveTab('summary')}>Change Summary</button>
                <button className={`tab${activeTab === 'gaps' ? ' active' : ''}`} onClick={() => setActiveTab('gaps')}>
                  Gaps / Warnings {result.gapsOrWarnings ? '⚠️' : ''}
                </button>
              </div>

              <div style={{ padding: '0 20px 20px' }}>
                {activeTab === 'resume' && (
                  <div className="resume-output">
                    <ReactMarkdown>{result.generatedContent ?? ''}</ReactMarkdown>
                  </div>
                )}
                {activeTab === 'summary' && (
                  <div className="resume-output">
                    <ReactMarkdown>{result.changeSummary ?? 'No changes listed.'}</ReactMarkdown>
                  </div>
                )}
                {activeTab === 'gaps' && (
                  <div className="resume-output">
                    {result.gapsOrWarnings
                      ? <ReactMarkdown>{result.gapsOrWarnings}</ReactMarkdown>
                      : <p style={{ color: 'var(--success)' }}>✓ No significant gaps identified.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Generation History</h2>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>{history.length} generated</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Job</th><th>Resume</th><th>Prompt</th><th>Generated</th><th>Action</th></tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((h) => (
                  <tr key={h.id}>
                    <td className="name-cell">{h.jobTitle ?? '—'}</td>
                    <td>{h.masterResumeName ?? '—'}</td>
                    <td>{h.promptTemplateName ?? '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(h.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => { setResult(h); setActiveTab('resume'); }}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
