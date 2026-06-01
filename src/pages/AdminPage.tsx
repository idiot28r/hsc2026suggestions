import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  fetchSubjects,
  fetchSyllabus,
  updateRecord,
  deleteRecord,
  createSubject,
  createSection,
  createChapter,
  createTopic,
  resetLocalContent,
  dataMode,
  adminLogin,
  adminValid,
  adminLogout,
  type DbTable,
} from '../lib/data'
import type { Chapter, GroupKey, Section, Subject, SubjectWithSyllabus } from '../lib/types'
import { GROUPS } from '../lib/types'
import { useUserParams } from '../lib/useUserParams'
import StarRating from '../components/StarRating'
import ThemeToggle from '../components/ThemeToggle'
import Toast, { type ToastMsg } from '../components/Toast'

export default function AdminPage() {
  const [params] = useSearchParams()
  // The admin entrance is hidden unless ?admin=true is on the URL.
  if (params.get('admin') !== 'true') return <Navigate to="/" replace />
  // Local/demo mode has no auth backend — open the manager for local editing.
  if (dataMode === 'local') return <AdminManager />
  return <AdminAuthGate />
}

function AdminAuthGate() {
  const [ok, setOk] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    adminValid().then(setOk)
  }, [])
  if (ok === undefined) return <div className="empty" style={{ paddingTop: 80 }}>লোড হচ্ছে…</div>
  if (!ok) return <AdminLogin onSuccess={() => setOk(true)} />
  return <AdminManager onLogout={() => setOk(false)} />
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = await adminLogin(username.trim(), pw)
    setBusy(false)
    if (ok) onSuccess()
    else setError('লগইন ব্যর্থ — ইউজারনেম বা পাসওয়ার্ড সঠিক নয়।')
  }

  return (
    <div className="gate">
      <form className="card gate-card" onSubmit={submit}>
        <div className="gate-lock">🔐</div>
        <h2>অ্যাডমিন লগইন</h2>
        <p className="muted">Syllabus Manager-এ প্রবেশ করতে লগইন করুন।</p>
        <input
          type="text"
          autoFocus
          required
          autoComplete="username"
          className="gate-input"
          style={{ letterSpacing: 'normal', textAlign: 'left' }}
          placeholder="ইউজারনেম"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError('') }}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          className={`gate-input ${error ? 'err' : ''}`}
          style={{ letterSpacing: 'normal', textAlign: 'left' }}
          placeholder="পাসওয়ার্ড"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError('') }}
        />
        {error && <div className="gate-err">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'প্রবেশ করা হচ্ছে…' : 'প্রবেশ করুন'}
        </button>
        <Link to="/" className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
          ← অ্যাপে ফিরে যান
        </Link>
      </form>
    </div>
  )
}

function AdminManager({ onLogout }: { onLogout?: () => void }) {
  const user = useUserParams()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [syllabus, setSyllabus] = useState<SubjectWithSyllabus | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMsg | null>(null)

  const notify = useCallback((text: string, kind: ToastMsg['kind'] = 'ok') => {
    setToast({ text, kind, id: Date.now() })
  }, [])

  const loadGrid = useCallback(async () => {
    setLoading(true)
    setSubjects(await fetchSubjects(true))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadGrid()
  }, [loadGrid])

  const openSyllabus = useCallback(async (id: string) => {
    setActiveId(id)
    setSyllabus(null)
    setSyllabus(await fetchSyllabus(id))
  }, [])

  async function save(table: DbTable, id: string, patch: Record<string, unknown>) {
    try {
      await updateRecord(table, id, patch)
    } catch (e) {
      notify('সংরক্ষণ ব্যর্থ: ' + (e as Error).message, 'err')
    }
  }

  async function remove(table: DbTable, id: string, after: () => void) {
    if (!confirm('নিশ্চিতভাবে মুছে ফেলবেন? এটি ফেরানো যাবে না।')) return
    try {
      await deleteRecord(table, id)
      notify('মুছে ফেলা হয়েছে')
      after()
    } catch (e) {
      notify('মুছতে ব্যর্থ: ' + (e as Error).message, 'err')
    }
  }

  async function addSubject(group: GroupKey) {
    const id = prompt('বিষয়ের ছোট আইডি (URL-এ ব্যবহৃত হবে, যেমন: phy1_hsc):')?.trim()
    if (!id) return
    const rankKey = ({ science: 'rank_science', business: 'rank_business', humanities: 'rank_humanities' } as const)[group]
    try {
      await createSubject({ id, title: 'নতুন বিষয়', [rankKey]: 99 })
      notify('বিষয় যোগ হয়েছে')
      loadGrid()
    } catch (e) {
      notify('যোগ করতে ব্যর্থ: ' + (e as Error).message, 'err')
    }
  }

  return (
    <>
      <header className="appbar">
        <div className="container appbar-inner">
          <div className="brand-mark">⚙️</div>
          <div>
            <h1>Syllabus Manager</h1>
            <div className="sub">
              {dataMode === 'local' ? 'ডেমো মোড · localStorage' : 'Supabase লাইভ'} · পরিবর্তন সাথে সাথে সংরক্ষিত হয়
            </div>
          </div>
          <div className="spacer" />
          {dataMode === 'local' && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (confirm('ডেমো কনটেন্ট আবার সিড থেকে রিসেট করবেন?')) {
                  resetLocalContent()
                  setActiveId(null)
                  setSyllabus(null)
                  loadGrid()
                  notify('সিড থেকে রিসেট হয়েছে')
                }
              }}
            >
              ↺ Reset
            </button>
          )}
          <Link to={`/${user.carry}`} className="btn btn-soft btn-sm">
            অ্যাপ দেখুন
          </Link>
          {dataMode !== 'local' && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={async () => {
                await adminLogout()
                onLogout?.()
              }}
            >
              লগআউট
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="container" style={{ paddingBottom: 80 }}>
        {!activeId ? (
          <SubjectsGrid
            subjects={subjects}
            loading={loading}
            onEdit={openSyllabus}
            onSave={save}
            onDelete={(id) => remove('subjects', id, loadGrid)}
            onAdd={addSubject}
            onReload={loadGrid}
          />
        ) : (
          <SyllabusEditor
            subjectId={activeId}
            syllabus={syllabus}
            onBack={() => {
              setActiveId(null)
              setSyllabus(null)
              loadGrid()
            }}
            onSave={save}
            onDelete={remove}
            reload={() => openSyllabus(activeId)}
            notify={notify}
          />
        )}
      </main>

      <Toast msg={toast} />
    </>
  )
}

/* ── Editable helpers ───────────────────────────────────────────────────────── */

function Text({
  value,
  onSave,
  className,
  style,
  placeholder,
}: {
  value: string
  onSave: (v: string) => void
  className?: string
  style?: React.CSSProperties
  placeholder?: string
}) {
  const [v, setV] = useState(value)
  useEffect(() => setV(value), [value])
  return (
    <input
      className={`editable ${className ?? ''}`}
      style={style}
      value={v}
      placeholder={placeholder}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => v !== value && onSave(v)}
    />
  )
}

function Num({
  value,
  onSave,
  onLive,
  style,
}: {
  value: number
  onSave: (v: number) => void
  onLive?: (v: number) => void
  style?: React.CSSProperties
}) {
  const [v, setV] = useState(String(value))
  useEffect(() => setV(String(value)), [value])
  return (
    <input
      type="number"
      className="editable num"
      style={style}
      value={v}
      onChange={(e) => {
        setV(e.target.value)
        onLive?.(Number(e.target.value))
      }}
      onBlur={() => Number(v) !== value && onSave(Number(v))}
    />
  )
}

/* ── Subjects grid ──────────────────────────────────────────────────────────── */

const RANK_KEY: Record<GroupKey, 'rank_science' | 'rank_business' | 'rank_humanities'> = {
  science: 'rank_science',
  business: 'rank_business',
  humanities: 'rank_humanities',
}

function SubjectsGrid({
  subjects,
  loading,
  onEdit,
  onSave,
  onDelete,
  onAdd,
  onReload,
}: {
  subjects: Subject[]
  loading: boolean
  onEdit: (id: string) => void
  onSave: (table: DbTable, id: string, patch: Record<string, unknown>) => Promise<void> | void
  onDelete: (id: string) => void
  onAdd: (group: GroupKey) => void
  onReload: () => void
}) {
  const [group, setGroup] = useState<GroupKey>('science')
  const [assignPick, setAssignPick] = useState('')

  if (loading) return <div className="empty">লোড হচ্ছে…</div>

  const key = RANK_KEY[group]
  const inGroup = subjects
    .filter((s) => s[key] != null)
    .sort((a, b) => (a[key] as number) - (b[key] as number))
  const unassigned = subjects.filter((s) => s[key] == null)
  const nextRank = (k: typeof key) => {
    const peers = subjects.filter((s) => s[k] != null).map((s) => s[k] as number)
    return (peers.length ? Math.max(...peers) : 0) + 1
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= inGroup.length) return
    const a = inGroup[index]
    const b = inGroup[target]
    await onSave('subjects', a.id, { [key]: b[key] })
    await onSave('subjects', b.id, { [key]: a[key] })
    onReload()
  }

  async function toggleGroup(s: Subject, g: GroupKey) {
    const k = RANK_KEY[g]
    await onSave('subjects', s.id, { [k]: s[k] == null ? nextRank(k) : null })
    onReload()
  }

  async function assign() {
    if (!assignPick) return
    await onSave('subjects', assignPick, { [key]: nextRank(key) })
    setAssignPick('')
    onReload()
  }

  const groupLabel = GROUPS.find((g) => g.key === group)?.label

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 8px' }}>
        <div className="segment" role="tablist">
          {GROUPS.map((g) => (
            <button key={g.key} className={group === g.key ? 'active' : ''} onClick={() => setGroup(g.key)} role="tab">
              {g.emoji} {g.label}
            </button>
          ))}
        </div>
      </div>
      <p className="muted" style={{ margin: '4px 2px 12px', fontSize: '0.82rem' }}>
        ↑/↓ দিয়ে এই গ্রুপে বিষয়ের ক্রম সাজাও · গ্রুপ চিপে ক্লিক করে কোন গ্রুপে দেখাবে ঠিক করো · লেখা/সংখ্যায় ক্লিক করে সম্পাদনা করো।
      </p>

      {unassigned.length > 0 && (
        <div className="card assign-bar">
          <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>এই গ্রুপে যোগ করো:</span>
          <select className="assign-select" value={assignPick} onChange={(e) => setAssignPick(e.target.value)}>
            <option value="">— বিষয় বাছাই করো —</option>
            {unassigned.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <button className="btn btn-soft btn-sm" onClick={assign} disabled={!assignPick}>
            যোগ করো
          </button>
        </div>
      )}

      {inGroup.length === 0 ? (
        <div className="empty">এই গ্রুপে কোনো বিষয় নেই। উপরের বার থেকে যোগ করো বা নিচে নতুন বিষয় তৈরি করো।</div>
      ) : (
        <div className="subjects-grid">
          {inGroup.map((s, i) => (
            <div key={s.id} className="card subject-card" style={{ cursor: 'default' }}>
              <button className="del-x" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => onDelete(s.id)}>
                ✕
              </button>

              <div className="card-toolbar">
                <button className="reorder-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="উপরে তোলো">
                  ↑
                </button>
                <span className="rank-pos">#{i + 1}</span>
                <button className="reorder-btn" disabled={i === inGroup.length - 1} onClick={() => move(i, 1)} aria-label="নিচে নামাও">
                  ↓
                </button>
              </div>

              <div className="top">
                <Text
                  value={s.icon_emoji || '📘'}
                  onSave={(v) => onSave('subjects', s.id, { icon_emoji: v })}
                  style={{ width: 50, fontSize: '1.5rem', textAlign: 'center' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text value={s.title} onSave={(v) => onSave('subjects', s.id, { title: v })} style={{ fontWeight: 800 }} />
                  <Text
                    value={s.short_code || ''}
                    placeholder="short code"
                    onSave={(v) => onSave('subjects', s.id, { short_code: v })}
                    style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              <div className="mark-pills">
                <Pill label="Max CQ" value={s.max_cq} onSave={(v) => onSave('subjects', s.id, { max_cq: v })} />
                <Pill label="Max MCQ" value={s.max_mcq} onSave={(v) => onSave('subjects', s.id, { max_mcq: v })} />
                <Pill label="Max SQ" value={s.max_sq} warn onSave={(v) => onSave('subjects', s.id, { max_sq: v })} />
              </div>

              <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                {GROUPS.map((g) => (
                  <button
                    key={g.key}
                    className={`group-chip ${s[RANK_KEY[g.key]] != null ? 'on' : ''}`}
                    onClick={() => toggleGroup(s, g.key)}
                    title={`${g.label}-এ ${s[RANK_KEY[g.key]] != null ? 'দেখানো হচ্ছে' : 'দেখানো হচ্ছে না'}`}
                  >
                    {g.emoji}
                  </button>
                ))}
                <label className="row" style={{ gap: 4, marginLeft: 'auto', fontWeight: 700, fontSize: '0.72rem' }}>
                  <input
                    type="checkbox"
                    className="chk"
                    style={{ width: 16, height: 16 }}
                    checked={s.is_active}
                    onChange={(e) => onSave('subjects', s.id, { is_active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <button className="btn btn-soft btn-sm" onClick={() => onEdit(s.id)}>
                অধ্যায় ও টপিক সম্পাদনা →
              </button>
            </div>
          ))}
          <button className="dashed-add" onClick={() => onAdd(group)}>
            + নতুন বিষয় ({groupLabel})
          </button>
        </div>
      )}
    </>
  )
}

function Pill({ label, value, onSave, warn }: { label: string; value: number; onSave: (v: number) => void; warn?: boolean }) {
  return (
    <div className={`mark-pill ${warn ? 'sq' : ''}`}>
      <div className="k">{label}</div>
      <Num value={value} onSave={onSave} style={{ fontSize: '1.05rem', fontWeight: 800, width: 50 }} />
    </div>
  )
}

/* ── Syllabus editor ────────────────────────────────────────────────────────── */

function SyllabusEditor({
  subjectId,
  syllabus,
  onBack,
  onSave,
  onDelete,
  reload,
  notify,
}: {
  subjectId: string
  syllabus: SubjectWithSyllabus | null
  onBack: () => void
  onSave: (table: DbTable, id: string, patch: Record<string, unknown>) => void
  onDelete: (table: DbTable, id: string, after: () => void) => void
  reload: () => void
  notify: (t: string, k?: ToastMsg['kind']) => void
}) {
  if (!syllabus) return <div className="empty">সিলেবাস লোড হচ্ছে…</div>

  return (
    <div style={{ paddingTop: 16 }}>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← গ্রিডে ফিরুন
        </button>
      </div>

      <h2 style={{ margin: '0 0 14px' }}>
        <Text value={syllabus.title} onSave={(v) => onSave('subjects', subjectId, { title: v })} style={{ fontSize: '1.25rem', fontWeight: 800 }} />
      </h2>

      <CqRuleBar syllabus={syllabus} subjectId={subjectId} onSave={onSave} />

      {syllabus.sections.map((sec) => (
        <SectionEditor key={sec.id} section={sec} onSave={onSave} onDelete={onDelete} reload={reload} />
      ))}

      <button
        className="dashed-add"
        style={{ marginTop: 12 }}
        onClick={async () => {
          await createSection(subjectId)
          notify('নতুন গ্রুপ যোগ হয়েছে')
          reload()
        }}
      >
        + নতুন গ্রুপ যোগ করুন
      </button>
    </div>
  )
}

/** Subject-level CQ-rule summary: total marks, per-question value, the derived
 *  "answer M questions", and live validation of the section minimums. */
function CqRuleBar({
  syllabus,
  subjectId,
  onSave,
}: {
  syllabus: SubjectWithSyllabus
  subjectId: string
  onSave: (table: DbTable, id: string, patch: Record<string, unknown>) => void
}) {
  // Local mirror so the derived "answer M" updates live as the expert types.
  const [maxCq, setMaxCq] = useState(Number(syllabus.max_cq))
  const [cqVal, setCqVal] = useState(Number(syllabus.cq_value_per_q))
  useEffect(() => {
    setMaxCq(Number(syllabus.max_cq))
    setCqVal(Number(syllabus.cq_value_per_q))
  }, [syllabus.max_cq, syllabus.cq_value_per_q])

  const answerM = cqVal > 0 ? Math.round(maxCq / cqVal) : 0
  const sumMin = syllabus.sections.reduce((a, s) => a + (Number(s.min_cq_required) || 0), 0)
  const sumAvail = syllabus.sections.reduce((a, s) => a + (Number(s.total_cq_available) || 0), 0)
  const optional = Math.max(0, answerM - sumMin)
  const noCq = maxCq <= 0

  return (
    <div className="card cq-rule">
      <div className="cq-rule-head">📋 সৃজনশীল প্রশ্নের নিয়ম</div>
      {noCq ? (
        <div className="cq-rule-line muted">এই বিষয়ে সৃজনশীল (CQ) নেই — নিচের গ্রুপগুলো শুধু MCQ/SQ ও অধ্যায়ের জন্য।</div>
      ) : (
        <>
          <div className="cq-rule-fields">
            <label>
              মোট CQ নম্বর
              <Num value={syllabus.max_cq} onLive={setMaxCq} onSave={(v) => onSave('subjects', subjectId, { max_cq: v })} />
            </label>
            <label>
              প্রতি প্রশ্নের নম্বর
              <Num value={syllabus.cq_value_per_q} onLive={setCqVal} onSave={(v) => onSave('subjects', subjectId, { cq_value_per_q: v })} />
            </label>
            <div className="cq-rule-answer">
              শিক্ষার্থীকে উত্তর দিতে হবে <b>{answerM}</b> টি প্রশ্ন
            </div>
          </div>
          <div className={`cq-rule-check ${sumMin > answerM ? 'bad' : 'ok'}`}>
            {sumMin > answerM ? (
              <>⚠️ সব গ্রুপের আবশ্যক যোগফল ({sumMin}) উত্তরসংখ্যা ({answerM})-এর চেয়ে বেশি — কমাও।</>
            ) : (
              <>
                আবশ্যক মোট <b>{sumMin}</b> টি · {optional > 0 ? `বাকি ${optional} টি যেকোনো গ্রুপ থেকে` : 'কোনো ঐচ্ছিক প্রশ্ন নেই'} · মোট প্রশ্ন আসবে {sumAvail} টি
              </>
            )}
          </div>
        </>
      )}
      {Number(syllabus.max_sq) > 0 && (
        <div className="cq-rule-line">
          <span className="muted">সংক্ষিপ্ত (SQ): মোট {syllabus.max_sq} নম্বর · প্রতি প্রশ্নে</span>
          <Num value={syllabus.sq_value_per_q} onSave={(v) => onSave('subjects', subjectId, { sq_value_per_q: v })} />
        </div>
      )}
    </div>
  )
}

function SectionEditor({
  section,
  onSave,
  onDelete,
  reload,
}: {
  section: Section
  onSave: (table: DbTable, id: string, patch: Record<string, unknown>) => void
  onDelete: (table: DbTable, id: string, after: () => void) => void
  reload: () => void
}) {
  const [min, setMin] = useState(Number(section.min_cq_required))
  const [avail, setAvail] = useState(Number(section.total_cq_available))
  useEffect(() => {
    setMin(Number(section.min_cq_required))
    setAvail(Number(section.total_cq_available))
  }, [section.min_cq_required, section.total_cq_available])

  let hint = ''
  let bad = false
  if (avail <= 0) hint = 'এই গ্রুপ থেকে কোনো সৃজনশীল প্রশ্ন আসবে না (শুধু অধ্যায় ও MCQ/SQ)।'
  else if (min <= 0) hint = `এই গ্রুপ থেকে ${avail} টি প্রশ্ন আসবে · উত্তর দেওয়া বাধ্যতামূলক নয়।`
  else hint = `এই গ্রুপ থেকে ${avail} টি প্রশ্ন আসবে · কমপক্ষে ${min} টির উত্তর আবশ্যক।`
  if (avail > 0 && min > avail) {
    hint = `⚠️ আবশ্যক উত্তর (${min}) প্রশ্নসংখ্যা (${avail})-এর চেয়ে বেশি — ঠিক করো।`
    bad = true
  }

  return (
    <div className="card" style={{ marginBottom: 16, overflow: 'hidden' }}>
      <div className="section-bar" style={{ background: 'var(--surface-2)', padding: 12, borderBottom: '1px solid var(--border)' }}>
        <Text value={section.title} placeholder="গ্রুপ / বিভাগের নাম" onSave={(v) => onSave('sections', section.id, { title: v })} style={{ fontWeight: 800, color: 'var(--primary-700)' }} />
        <span className="row" style={{ gap: 10, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
          <label className="seg-field" title="এই গ্রুপ থেকে কমপক্ষে কয়টি সৃজনশীলের উত্তর দিতে হবে। ০ দিলে এই গ্রুপ থেকে উত্তর দেওয়া বাধ্যতামূলক নয়।">
            আবশ্যক উত্তর
            <Num value={section.min_cq_required} onLive={setMin} onSave={(v) => onSave('sections', section.id, { min_cq_required: v })} />
          </label>
          <label className="seg-field" title="এই গ্রুপের অধ্যায়গুলো থেকে কয়টি সৃজনশীল প্রশ্ন প্রশ্নপত্রে আসবে।">
            প্রশ্ন আসবে
            <Num value={section.total_cq_available} onLive={setAvail} onSave={(v) => onSave('sections', section.id, { total_cq_available: v })} />
          </label>
          <button className="del-x" onClick={() => onDelete('sections', section.id, reload)}>
            ✕
          </button>
        </span>
      </div>

      <div className={`section-rule-hint ${bad ? 'bad' : ''}`}>{hint}</div>

      <div style={{ padding: 6 }}>
        {section.chapters.map((chap) => (
          <ChapterEditor key={chap.id} chapter={chap} onSave={onSave} onDelete={onDelete} reload={reload} />
        ))}
        <div
          className="add-row"
          onClick={async () => {
            await createChapter(section.id)
            reload()
          }}
        >
          + অধ্যায় যোগ করুন
        </div>
      </div>
    </div>
  )
}

function ChapterEditor({
  chapter,
  onSave,
  onDelete,
  reload,
}: {
  chapter: Chapter
  onSave: (table: DbTable, id: string, patch: Record<string, unknown>) => void
  onDelete: (table: DbTable, id: string, after: () => void) => void
  reload: () => void
}) {
  const [open, setOpen] = useState(false)
  const totalWeight = chapter.topics.reduce((sum, t) => sum + (Number(t.weight) || 0), 0)
  return (
    <div className="chapter" style={{ marginBottom: 8 }}>
      <div className="chapter-head">
        <span className={`chev ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-hidden="true">
          <Chevron />
        </span>
        <Text value={chapter.title} onSave={(v) => onSave('chapters', chapter.id, { title: v })} style={{ fontWeight: 700 }} />
        <span className="weight-tally" title={`${chapter.topics.length} টপিকের মোট গুরুত্ব`}>
          Σ {totalWeight}
        </span>
        <span className="row" style={{ gap: 4, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
          MCQ
          <Num value={chapter.est_mcq} onSave={(v) => onSave('chapters', chapter.id, { est_mcq: v })} style={{ width: 40 }} />
          <span className="sq" style={{ color: 'var(--warn)' }}>SQ</span>
          <Num value={chapter.est_sq} onSave={(v) => onSave('chapters', chapter.id, { est_sq: v })} style={{ width: 40 }} />
          <button className="del-x" onClick={() => onDelete('chapters', chapter.id, reload)}>
            ✕
          </button>
        </span>
      </div>

      {open && (
        <ul className="topic-list">
          {chapter.topics.map((t) => (
            <li key={t.id} className="topic">
              <Text value={t.title} onSave={(v) => onSave('topics', t.id, { title: v })} style={{ flex: 1 }} />
              <StarRating weight={t.weight} />
              <WeightField topicId={t.id} weight={t.weight} onSave={onSave} />
              <button className="del-x" onClick={() => onDelete('topics', t.id, reload)}>
                ✕
              </button>
            </li>
          ))}
          <li>
            <span
              className="add-row"
              style={{ display: 'inline-block', padding: '6px 12px', background: 'transparent', color: 'var(--primary)' }}
              onClick={async () => {
                await createTopic(chapter.id)
                reload()
              }}
            >
              + টপিক যোগ করুন
            </span>
          </li>
        </ul>
      )}
    </div>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function WeightField({
  topicId,
  weight,
  onSave,
}: {
  topicId: string
  weight: number
  onSave: (table: DbTable, id: string, patch: Record<string, unknown>) => void
}) {
  const [v, setV] = useState(weight)
  useEffect(() => setV(weight), [weight])
  return (
    <span className="row" style={{ gap: 2, fontSize: '0.72rem', fontWeight: 700 }} title="গুরুত্ব (0–100)">
      <input
        type="number"
        className="editable num"
        style={{ width: 48 }}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        onBlur={() => v !== weight && onSave('topics', topicId, { weight: v })}
      />
      %
    </span>
  )
}
