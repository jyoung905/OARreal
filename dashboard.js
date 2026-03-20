const leadList = document.getElementById('leadList');
const leadCountLabel = document.getElementById('leadCountLabel');
const leadDetail = document.getElementById('leadDetail');
const leadEmptyState = document.getElementById('leadEmptyState');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const bucketFilter = document.getElementById('bucketFilter');
const countChips = document.getElementById('countChips');
const dashboardStats = document.getElementById('dashboardStats');
const refreshBtn = document.getElementById('refreshBtn');
const detailStatus = document.getElementById('detailStatus');
const detailNotes = document.getElementById('detailNotes');
const saveLeadBtn = document.getElementById('saveLeadBtn');
const saveMessage = document.getElementById('saveMessage');
const dashboardWarning = document.getElementById('dashboardWarning');
const dashboardApp = document.getElementById('dashboardApp');
const loginPanel = document.getElementById('loginPanel');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const downloadTextBtn = document.getElementById('downloadTextBtn');
const openHandoffBtn = document.getElementById('openHandoffBtn');
const selectionSummary = document.getElementById('selectionSummary');
const workflowShortcuts = document.getElementById('workflowShortcuts');
const markSentBtn = document.getElementById('markSentBtn');
const authSetupBadge = document.getElementById('authSetupBadge');
const passwordSetupHint = document.getElementById('passwordSetupHint');
const passwordTestHint = document.getElementById('passwordTestHint');
const copySetupCommandBtn = document.getElementById('copySetupCommandBtn');
const setupCurl = document.getElementById('setupCurl');
const followUpPriority = document.getElementById('followUpPriority');
const followUpOn = document.getElementById('followUpOn');
const followUpNote = document.getElementById('followUpNote');
const requestedDocsChoices = document.getElementById('requestedDocsChoices');
const customRequestedDocs = document.getElementById('customRequestedDocs');
const lastContactedAt = document.getElementById('lastContactedAt');

const checklistInputs = {
  conflictCheck: document.getElementById('checkConflict'),
  docsRequested: document.getElementById('checkDocsRequested'),
  clientFollowUpSent: document.getElementById('checkClientFollowUp'),
  summaryReady: document.getElementById('checkSummaryReady'),
  referralReady: document.getElementById('checkReferralReady')
};

let meta = null;
let currentLeadId = null;
let currentLeads = [];
let currentLead = null;
let searchDebounce = null;

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || 'Request failed.');
    error.code = response.status;
    throw error;
  }
  return result;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function formatDateOnly(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}

function formatBucketClass(value) {
  return `bucket-${String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function formatStatusClass(value) {
  return `status-${String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

function labelForPriority(value) {
  return {
    today: 'Today',
    'this week': 'This week',
    watch: 'Watch / pending',
    none: 'No follow-up set'
  }[value] || value;
}

function renderStatusOptions(select, selected, includeAll = false) {
  const options = [];
  if (includeAll) options.push('<option value="">All statuses</option>');
  options.push(...(meta?.statuses || []).map((status) => `<option value="${escapeHtml(status)}" ${status === selected ? 'selected' : ''}>${escapeHtml(status)}</option>`));
  select.innerHTML = options.join('');
}

function renderBucketOptions(selected = '') {
  const options = ['<option value="">All buckets</option>'];
  for (const bucket of meta?.buckets || []) {
    options.push(`<option value="${escapeHtml(bucket)}" ${bucket === selected ? 'selected' : ''}>${escapeHtml(bucket)}</option>`);
  }
  bucketFilter.innerHTML = options.join('');
}

function renderFollowUpPriorityOptions(selected = 'none') {
  followUpPriority.innerHTML = (meta?.followUpPriorities || []).map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? 'selected' : ''}>${escapeHtml(labelForPriority(value))}</option>`).join('');
}

function renderRequestedDocOptions(selected = []) {
  const selectedSet = new Set(selected);
  requestedDocsChoices.innerHTML = (meta?.requestedDocOptions || []).map((item) => `
    <label class="check-toggle doc-toggle">
      <input type="checkbox" value="${escapeHtml(item)}" ${selectedSet.has(item) ? 'checked' : ''} />
      ${escapeHtml(item)}
    </label>
  `).join('');
}

function setWarning() {
  const accessNote = meta?.localhostOnly ? 'Dashboard is localhost-only by default.' : 'Remote dashboard access is enabled.';
  const authNote = meta?.authEnabled ? 'Password login is enabled.' : 'No dashboard password is configured.';
  dashboardWarning.textContent = `${accessNote} ${authNote} This is an internal intake screen, not a public page.`;
}

function setLoginHints() {
  const verifyCommand = meta?.setup?.verifyLoginCurl || setupCurl.textContent;
  setupCurl.textContent = verifyCommand;

  if (!meta?.authEnabled) {
    authSetupBadge.textContent = 'Password missing';
    passwordSetupHint.innerHTML = 'Set <code>DASHBOARD_PASSWORD</code> in <code>.env</code>, restart <code>node server.js</code>, then refresh this page.';
    passwordTestHint.innerHTML = `Quick check after restart: <code>${escapeHtml(verifyCommand)}</code>`;
    return;
  }

  authSetupBadge.textContent = meta.placeholderPassword ? 'Replace example password' : 'Ready for local use';
  passwordSetupHint.innerHTML = meta.placeholderPassword
    ? 'Replace the placeholder <code>DASHBOARD_PASSWORD</code> in <code>.env</code> before real use.'
    : `Password is configured. Session length is about ${meta.sessionTtlHours || 12} hour${(meta.sessionTtlHours || 12) === 1 ? '' : 's'}.`;
  passwordTestHint.innerHTML = 'Unlock here, refresh to confirm the session persists, then use <code>Log out</code> to confirm the session clears cleanly.';
}

function renderCountChips(counts) {
  const chips = [`<span class="status-chip active">All · ${counts.all || 0}</span>`];
  for (const status of meta?.statuses || []) {
    chips.push(`<span class="status-chip">${escapeHtml(status)} · ${counts[status] || 0}</span>`);
  }
  countChips.innerHTML = chips.join('');
}

function renderStats(stats = {}) {
  dashboardStats.innerHTML = [
    ['Unreviewed', stats.unreviewed || 0, 'New or reviewing requests still waiting on attention'],
    ['Need docs / follow-up', stats.needDocs || 0, 'Requests that look promising but still need something'],
    ['Good fit', stats.goodFit || 0, 'Good-fit or handoff-ready requests'],
    ['Sent to firm', stats.sentToFirm || 0, 'Already handed off onward'],
    ['Due today', stats.dueToday || 0, 'Follow-up work to clear today']
  ].map(([label, value, note]) => `
    <div class="stat-card">
      <span class="stat-label">${escapeHtml(label)}</span>
      <strong>${value}</strong>
      <span class="stat-note">${escapeHtml(note)}</span>
    </div>
  `).join('');
}

function renderLeadList(leads) {
  leadCountLabel.textContent = `${leads.length} request${leads.length === 1 ? '' : 's'}`;
  selectionSummary.textContent = currentLeadId ? 'Selected review request' : 'Auto-selecting first visible request';

  if (!leads.length) {
    leadList.innerHTML = '<div class="empty-list">No review requests match this filter yet.</div>';
    return;
  }

  leadList.innerHTML = leads.map((lead) => `
    <button class="lead-row ${lead.id === currentLeadId ? 'active' : ''}" data-id="${lead.id}">
      <div class="lead-row-top">
        <div>
          <strong>${escapeHtml(lead.fullName)}</strong>
          <div class="lead-row-meta">${escapeHtml(lead.email)} · ${escapeHtml(lead.phone)}</div>
        </div>
        <span class="status-pill ${formatStatusClass(lead.status)}">${escapeHtml(lead.status)}</span>
      </div>
      <div class="lead-row-scanline">
        <span class="bucket-pill ${formatBucketClass(lead.bucket)}">${escapeHtml(lead.bucket)}</span>
        <span>${escapeHtml(lead.accidentType)}</span>
        <span>${escapeHtml(lead.cityArea)}</span>
        <span>Score ${lead.score}</span>
      </div>
      <div class="lead-row-inline-meta">
        ${lead.followUpPriority && lead.followUpPriority !== 'none' ? `<span class="inline-meta-pill">${escapeHtml(labelForPriority(lead.followUpPriority))}${lead.followUpOn ? ` · ${escapeHtml(formatDateOnly(lead.followUpOn))}` : ''}</span>` : ''}
        ${lead.requestedDocsCount ? `<span class="inline-meta-pill">${lead.requestedDocsCount} doc${lead.requestedDocsCount === 1 ? '' : 's'} tracked</span>` : ''}
      </div>
      <div class="lead-row-bottom">
        <span>${formatDate(lead.submittedAt)}</span>
        <span>${lead.sentToFirmAt ? `Sent ${formatDate(lead.sentToFirmAt)}` : (lead.dashboardUpdatedAt ? `Updated ${formatDate(lead.dashboardUpdatedAt)}` : 'Not reviewed yet')}</span>
      </div>
      ${lead.notesPreview ? `<div class="lead-row-notes">${escapeHtml(lead.notesPreview)}</div>` : ''}
    </button>
  `).join('');

  leadList.querySelectorAll('.lead-row').forEach((button) => {
    button.addEventListener('click', () => loadLead(button.dataset.id));
  });
}

function renderList(target, entries) {
  target.innerHTML = entries.map(([label, value]) => `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value || '—')}</dd>
    </div>
  `).join('');
}

function renderTags(target, values) {
  target.innerHTML = values && values.length
    ? values.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join('')
    : '<span class="page-meta">None noted</span>';
}

function renderChecklist(lead) {
  const checks = [
    ['Ontario accident', lead.data.inOntario === 'Yes'],
    ['Not currently represented', lead.data.currentlyRepresented === 'No'],
    ['Injury reported', lead.data.injured === 'Yes'],
    ['Impact on work or daily life', lead.data.workImpact === 'Yes'],
    ['Docs tracked if needed', Boolean(lead.dashboard.requestedDocsCount) || !lead.dashboard.checklist.docsRequested],
    ['Conflict check done', Boolean(lead.dashboard.checklist.conflictCheck)],
    ['Client follow-up sent', Boolean(lead.dashboard.checklist.clientFollowUpSent)],
    ['Summary ready', Boolean(lead.dashboard.checklist.summaryReady)],
    ['Referral ready', Boolean(lead.dashboard.checklist.referralReady)],
    ['Marked sent to firm', Boolean(lead.dashboard.sentToFirmAt)]
  ];
  document.getElementById('handoffChecklist').innerHTML = checks.map(([label, ok]) => `
    <div class="checklist-item ${ok ? 'is-checked' : ''}">
      <span class="check-icon">${ok ? '✓' : '•'}</span>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join('');
}

function buildWorkflowShortcuts(status) {
  const preferred = ['reviewing', 'need docs / follow-up', 'good fit', 'ready to hand off', 'sent to firm', 'not a fit'];
  workflowShortcuts.innerHTML = preferred.filter((value) => meta?.statuses?.includes(value)).map((value) => `
    <button class="status-chip ${value === status ? 'active' : ''}" type="button" data-status="${escapeHtml(value)}">${escapeHtml(value)}</button>
  `).join('');
  workflowShortcuts.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      detailStatus.value = button.dataset.status;
      buildWorkflowShortcuts(button.dataset.status);
    });
  });
}

function getRequestedDocsSelection() {
  return Array.from(requestedDocsChoices.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
}

function getChecklistPayload() {
  return Object.fromEntries(Object.entries(checklistInputs).map(([key, input]) => [key, Boolean(input.checked)]));
}

function setChecklistInputs(checklist = {}) {
  for (const [key, input] of Object.entries(checklistInputs)) {
    input.checked = Boolean(checklist[key]);
  }
}

async function loadMeta() {
  meta = await fetchJson('/api/dashboard/meta');
  renderStatusOptions(statusFilter, '', true);
  renderStatusOptions(detailStatus, 'new');
  renderBucketOptions();
  renderFollowUpPriorityOptions('none');
  renderRequestedDocOptions([]);
  setWarning();
  setLoginHints();
  logoutBtn.classList.toggle('hidden', !meta.authEnabled);
}

async function loadLeads() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (statusFilter.value) params.set('status', statusFilter.value);
  if (bucketFilter.value) params.set('bucket', bucketFilter.value);
  const result = await fetchJson(`/api/dashboard/leads?${params.toString()}`);
  currentLeads = result.leads;
  renderCountChips(result.counts);
  renderStats(result.stats);
  renderLeadList(result.leads);

  if (currentLeadId && currentLeads.some((lead) => lead.id === currentLeadId)) {
    await loadLead(currentLeadId, { silentListReload: true });
  } else if (currentLeads.length) {
    await loadLead(currentLeads[0].id, { silentListReload: true });
  } else {
    currentLeadId = null;
    currentLead = null;
    leadDetail.classList.add('hidden');
    leadEmptyState.classList.remove('hidden');
  }
}

async function loadLead(id, options = {}) {
  currentLeadId = id;
  if (!options.silentListReload) renderLeadList(currentLeads);

  const result = await fetchJson(`/api/dashboard/leads/${encodeURIComponent(id)}`);
  const lead = result.lead;
  currentLead = lead;
  leadEmptyState.classList.add('hidden');
  leadDetail.classList.remove('hidden');

  const allRequestedDocs = [...(lead.dashboard.requestedDocs || []), ...(lead.dashboard.customRequestedDocs || [])];

  document.getElementById('detailName').textContent = lead.data.fullName;
  document.getElementById('detailMeta').textContent = `${lead.data.accidentType} · ${lead.data.cityArea} · submitted ${formatDate(lead.submittedAt)}`;
  document.getElementById('detailBucket').textContent = `${lead.review.bucket} · score ${lead.review.score}`;
  document.getElementById('detailStatusPill').textContent = lead.dashboard.status;
  document.getElementById('detailStatusPill').className = `status-pill ${formatStatusClass(lead.dashboard.status)}`;
  document.getElementById('priorityText').textContent = `${lead.review.bucket} · ${lead.review.score}`;
  document.getElementById('uploadsCount').textContent = '0';
  document.getElementById('requestedDocsCount').textContent = String(allRequestedDocs.length);
  document.getElementById('followUpDueText').textContent = lead.dashboard.followUpOn ? formatDateOnly(lead.dashboard.followUpOn) : labelForPriority(lead.dashboard.followUpPriority || 'none');
  document.getElementById('sentToFirmText').textContent = lead.dashboard.sentToFirmAt ? formatDate(lead.dashboard.sentToFirmAt) : 'Not sent';
  markSentBtn.textContent = lead.dashboard.sentToFirmAt ? 'Update sent-to-firm timestamp' : 'Mark sent to firm';

  renderStatusOptions(detailStatus, lead.dashboard.status);
  buildWorkflowShortcuts(lead.dashboard.status);
  renderFollowUpPriorityOptions(lead.dashboard.followUpPriority || 'none');
  followUpOn.value = (lead.dashboard.followUpOn || '').slice(0, 10);
  followUpNote.value = lead.dashboard.followUpNote || '';
  renderRequestedDocOptions(lead.dashboard.requestedDocs || []);
  customRequestedDocs.value = (lead.dashboard.customRequestedDocs || []).join(', ');
  setChecklistInputs(lead.dashboard.checklist || {});
  lastContactedAt.value = toDateTimeLocal(lead.dashboard.lastContactedAt);
  detailNotes.value = lead.dashboard.notes || '';
  saveMessage.textContent = lead.dashboard.updatedAt ? `Last saved ${formatDate(lead.dashboard.updatedAt)}` : '';

  renderList(document.getElementById('contactList'), [
    ['Name', lead.data.fullName],
    ['Phone', lead.data.phone],
    ['Email', lead.data.email],
    ['Preferred contact', lead.data.contactMethod],
    ['Best time', lead.data.bestTime]
  ]);

  renderList(document.getElementById('matterList'), [
    ['Accident type', lead.data.accidentType],
    ['Date', lead.data.accidentDate],
    ['City / area', lead.data.cityArea],
    ['In Ontario', lead.data.inOntario],
    ['Injured', lead.data.injured],
    ['Medical attention', lead.data.medicalAttention],
    ['Work or daily-life impact', lead.data.workImpact],
    ['Ongoing symptoms', lead.data.ongoingSymptoms],
    ['Spoken with a lawyer already', lead.data.spokenWithLawyer],
    ['Currently represented', lead.data.currentlyRepresented],
    ['Possible other person / business involved', lead.data.thirdPartyInvolved],
    ['Follow-up due', lead.dashboard.followUpOn ? formatDateOnly(lead.dashboard.followUpOn) : labelForPriority(lead.dashboard.followUpPriority || 'none')],
    ['Docs tracked', allRequestedDocs.join(', ') || 'None tracked'],
    ['Last client contact', lead.dashboard.lastContactedAt ? formatDate(lead.dashboard.lastContactedAt) : 'Not logged'],
    ['Sent to firm', lead.dashboard.sentToFirmAt ? formatDate(lead.dashboard.sentToFirmAt) : 'Not yet'],
    ['Source page', lead.data.sourcePage]
  ]);

  document.getElementById('detailSummary').textContent = lead.data.accidentSummary || '—';
  renderTags(document.getElementById('seriousnessSignals'), [
    `Injured: ${lead.data.injured}`,
    `Medical attention: ${lead.data.medicalAttention}`,
    `Work impact: ${lead.data.workImpact}`,
    `Ongoing symptoms: ${lead.data.ongoingSymptoms}`
  ]);
  renderTags(document.getElementById('documentSignals'), allRequestedDocs.map((item) => `Requested: ${item}`));
  document.getElementById('uploadsList').innerHTML = '<p class="page-meta">Uploads are disabled in v1. This lead has no uploaded files.</p>';
  renderChecklist(lead);
  document.getElementById('detailDelivery').textContent = JSON.stringify(lead.delivery || {}, null, 2);
}

function buildSavePayload(forceStatus) {
  return {
    status: forceStatus || detailStatus.value,
    notes: detailNotes.value,
    followUpPriority: followUpPriority.value,
    followUpOn: followUpOn.value,
    followUpNote: followUpNote.value,
    requestedDocs: getRequestedDocsSelection(),
    customRequestedDocs: customRequestedDocs.value.split(',').map((item) => item.trim()).filter(Boolean),
    lastContactedAt: fromDateTimeLocal(lastContactedAt.value),
    checklist: getChecklistPayload()
  };
}

async function saveCurrentLead() {
  if (!currentLeadId) return;
  saveLeadBtn.disabled = true;
  saveMessage.textContent = 'Saving…';
  try {
    await fetchJson(`/api/dashboard/leads/${encodeURIComponent(currentLeadId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildSavePayload())
    });
    saveMessage.textContent = 'Workflow saved.';
    await loadLeads();
  } catch (error) {
    saveMessage.textContent = error.message || 'Save failed.';
  } finally {
    saveLeadBtn.disabled = false;
  }
}

async function markSentToFirm() {
  if (!currentLeadId) return;
  markSentBtn.disabled = true;
  saveMessage.textContent = 'Marking sent to firm…';
  try {
    const result = await fetchJson(`/api/dashboard/leads/${encodeURIComponent(currentLeadId)}/mark-sent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildSavePayload('sent to firm'))
    });
    saveMessage.textContent = result.dashboard?.sentToFirmAt ? `Marked sent to firm at ${formatDate(result.dashboard.sentToFirmAt)}` : 'Marked sent to firm.';
    await loadLeads();
  } catch (error) {
    saveMessage.textContent = error.message || 'Could not mark sent to firm.';
  } finally {
    markSentBtn.disabled = false;
  }
}

async function attemptLogin(password) {
  loginMessage.textContent = 'Unlocking…';
  await fetchJson('/api/dashboard/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  loginMessage.textContent = '';
  loginPanel.classList.add('hidden');
  dashboardApp.classList.remove('hidden');
  await loadMeta();
  await loadLeads();
}

async function logout() {
  await fetchJson('/api/dashboard/logout', { method: 'POST' });
  currentLeadId = null;
  currentLead = null;
  dashboardApp.classList.add('hidden');
  loginPanel.classList.remove('hidden');
  loginMessage.textContent = 'Logged out.';
  passwordInput.value = '';
}

function downloadCurrent(kind) {
  if (!currentLeadId) return;
  window.open(`/api/dashboard/leads/${encodeURIComponent(currentLeadId)}/export.${kind}`, '_blank', 'noopener');
}

async function copyCurrentSummary() {
  if (!currentLeadId) return;
  const result = await fetchJson(`/api/dashboard/leads/${encodeURIComponent(currentLeadId)}/export.txt?inline=1`);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(result.text || '');
    saveMessage.textContent = 'Handoff summary copied.';
  } else {
    saveMessage.textContent = 'Clipboard unavailable in this browser.';
  }
}

async function copySetupCommand() {
  const text = setupCurl.textContent || '';
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    loginMessage.textContent = 'Check command copied.';
  } else {
    loginMessage.textContent = 'Clipboard unavailable in this browser.';
  }
}

function showFatalError(error) {
  if (error.code === 401) {
    dashboardApp.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    loginMessage.textContent = 'Please log in to continue.';
    return;
  }
  leadList.innerHTML = `<div class="empty-list">${escapeHtml(error.message || 'Something went wrong.')}</div>`;
  saveMessage.textContent = error.message || 'Something went wrong.';
}

searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => loadLeads().catch(showFatalError), 220);
});
statusFilter.addEventListener('change', () => loadLeads().catch(showFatalError));
bucketFilter.addEventListener('change', () => loadLeads().catch(showFatalError));
refreshBtn.addEventListener('click', () => loadLeads().catch(showFatalError));
saveLeadBtn.addEventListener('click', () => saveCurrentLead().catch(showFatalError));
markSentBtn.addEventListener('click', () => markSentToFirm().catch(showFatalError));
copySetupCommandBtn.addEventListener('click', () => copySetupCommand().catch(showFatalError));
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await attemptLogin(passwordInput.value);
  } catch (error) {
    loginMessage.textContent = error.message || 'Login failed.';
  }
});
logoutBtn.addEventListener('click', () => logout().catch(showFatalError));
copySummaryBtn.addEventListener('click', () => copyCurrentSummary().catch(showFatalError));
downloadJsonBtn.addEventListener('click', () => downloadCurrent('json'));
downloadTextBtn.addEventListener('click', () => downloadCurrent('txt'));
openHandoffBtn.addEventListener('click', () => downloadCurrent('html'));

(async function init() {
  try {
    await loadMeta();
    if (meta.authEnabled) {
      try {
        await loadLeads();
        dashboardApp.classList.remove('hidden');
      } catch (error) {
        if (error.code === 401) {
          loginPanel.classList.remove('hidden');
          return;
        }
        throw error;
      }
    } else {
      dashboardApp.classList.remove('hidden');
      await loadLeads();
    }
  } catch (error) {
    showFatalError(error);
  }
})();
