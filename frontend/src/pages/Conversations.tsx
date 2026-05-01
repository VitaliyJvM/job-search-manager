import { useEffect, useState } from 'react';
import { conversationsApi } from '../api/conversations.ts';
import { contactsApi } from '../api/contacts.ts';
import type { Conversation, ConversationRequest, Contact, Channel, MessageDirection } from '../types/index.ts';
import Modal from '../components/Modal.tsx';
import ConfirmDialog from '../components/ConfirmDialog.tsx';
import StatusBadge from '../components/StatusBadge.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const CHANNELS: Channel[] = ['LINKEDIN', 'EMAIL', 'PHONE', 'IN_PERSON', 'OTHER'];
const DIRECTIONS: MessageDirection[] = ['INBOUND', 'OUTBOUND'];
const EMPTY_FORM: ConversationRequest = { contactId: 0, channel: undefined, messageDirection: 'OUTBOUND', messageText: '', conversationDate: '', nextFollowUpAt: '' };

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filterContact, setFilterContact] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Conversation | null>(null);
  const [form, setForm] = useState<ConversationRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([conversationsApi.getAll(filterContact ?? undefined), contactsApi.getAll()])
      .then(([c, co]) => { setConversations(c); setContacts(co); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [filterContact]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_FORM, contactId: filterContact ?? 0 }); setModalOpen(true); };
  const openEdit = (c: Conversation) => {
    setEditing(c);
    setForm({ contactId: c.contactId ?? 0, channel: c.channel, messageDirection: c.messageDirection ?? 'OUTBOUND', messageText: c.messageText ?? '', conversationDate: c.conversationDate ?? '', nextFollowUpAt: c.nextFollowUpAt ?? '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.contactId) { alert('Please select a contact'); return; }
    setSaving(true);
    try {
      if (editing) await conversationsApi.update(editing.id, form);
      else await conversationsApi.create(form);
      setModalOpen(false); load();
    } catch (e: unknown) { alert((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await conversationsApi.delete(deleteTarget.id); setDeleteTarget(null); load(); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Conversations</h1>
          <p className="page-subtitle">{conversations.length} message{conversations.length !== 1 ? 's' : ''} logged</p>
        </div>
        <button id="btn-add-conversation" className="btn btn-primary" onClick={openCreate}>+ Log Message</button>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="filter-bar">
        <button className={`filter-btn${filterContact === null ? ' active' : ''}`} onClick={() => setFilterContact(null)}>All Contacts</button>
        {contacts.map((c) => (
          <button key={c.id} className={`filter-btn${filterContact === c.id ? ' active' : ''}`} onClick={() => setFilterContact(c.id)}>
            {c.fullName}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        conversations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>No conversations logged</h3>
            <p>Track every message, call, and meeting here.</p>
          </div>
        ) : (
          <div className="timeline">
            {conversations.map((c) => (
              <div key={c.id} className={`timeline-item ${c.messageDirection?.toLowerCase() ?? 'inbound'}`}>
                <div>
                  <div className="timeline-bubble">
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <StatusBadge value={c.messageDirection} />
                      {c.channel && <StatusBadge value={c.channel} />}
                    </div>
                    {c.messageText}
                    <div className="timeline-meta">
                      <strong style={{ color: 'var(--text-secondary)' }}>{c.contactName ?? 'Unknown'}</strong>
                      {c.companyName && ` · ${c.companyName}`}
                      {c.conversationDate && ` · ${c.conversationDate}`}
                      {c.nextFollowUpAt && <span style={{ color: 'var(--warning)', marginLeft: 8 }}>⏰ Follow-up: {c.nextFollowUpAt}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(c)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Edit Message' : 'Log Message'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving && <span className="loading-spinner" style={{ width: 14, height: 14 }} />}
                Save
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="conv-contact">Contact *</label>
              <select id="conv-contact" value={form.contactId || ''} onChange={(e) => setForm({ ...form, contactId: Number(e.target.value) })}>
                <option value="">— Select contact —</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.fullName}{c.companyName ? ` (${c.companyName})` : ''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="conv-direction">Direction</label>
              <select id="conv-direction" value={form.messageDirection ?? ''} onChange={(e) => setForm({ ...form, messageDirection: e.target.value as MessageDirection })}>
                {DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="conv-channel">Channel</label>
              <select id="conv-channel" value={form.channel ?? ''} onChange={(e) => setForm({ ...form, channel: (e.target.value as Channel) || undefined })}>
                <option value="">— Select —</option>
                {CHANNELS.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="conv-date">Date</label>
              <input id="conv-date" type="date" value={form.conversationDate} onChange={(e) => setForm({ ...form, conversationDate: e.target.value })} />
            </div>
            <div className="form-group full-width">
              <label htmlFor="conv-text">Message</label>
              <textarea id="conv-text" value={form.messageText} onChange={(e) => setForm({ ...form, messageText: e.target.value })} rows={4} placeholder="What was discussed..." />
            </div>
            <div className="form-group full-width">
              <label htmlFor="conv-followup">Next Follow-Up</label>
              <input id="conv-followup" type="date" value={form.nextFollowUpAt} onChange={(e) => setForm({ ...form, nextFollowUpAt: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message="Delete this conversation entry?"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
