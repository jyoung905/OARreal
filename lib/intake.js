import crypto from 'node:crypto';
import { getIntakeTableName, getSupabaseAdminClient } from '@/lib/supabase-server';

const sanitizeText = (value, limit) => String(value || '').trim().slice(0, limit);

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'unreachable',
  'unqualified',
  'qualified',
  'referred',
  'accepted_by_partner',
  'rejected_by_partner',
  'spam',
  'test'
];

function firstNameFrom(payload) {
  return sanitizeText(payload.firstName || payload.fullName, 120).split(/\s+/).filter(Boolean)[0] || '';
}

function isTestLead(data) {
  const name = data.firstName.toLowerCase();
  const full = data.fullName.toLowerCase();
  const email = data.email.toLowerCase();
  const message = `${data.accidentSummary} ${data.additionalNotes}`.toLowerCase();
  return (
    name === 'test' ||
    full === 'test' ||
    full.startsWith('test ') ||
    full.includes('test do not contact') ||
    email.includes('test@example.com') ||
    email.includes('example.com') ||
    message.includes('test lead') ||
    message.includes('test submission')
  );
}

function normalizeStatus(status, data) {
  if (isTestLead(data)) return 'test';
  const clean = sanitizeText(status, 40);
  return LEAD_STATUSES.includes(clean) ? clean : 'new';
}

export function sanitizeLead(payload = {}) {
  const data = {
    fullName: sanitizeText(payload.fullName || payload.firstName, 120),
    firstName: firstNameFrom(payload),
    phone: sanitizeText(payload.phone, 40),
    email: sanitizeText(payload.email, 200),
    contactMethod: sanitizeText(payload.contactMethod, 40),
    bestTime: sanitizeText(payload.bestTime, 40),
    accidentType: sanitizeText(payload.accidentType, 80),
    accidentDate: sanitizeText(payload.accidentDate, 40),
    cityArea: sanitizeText(payload.cityArea || payload.cityRegion, 120),
    inOntario: sanitizeText(payload.inOntario || payload.happenedInOntario, 20),
    claimStatus: sanitizeText(payload.claimStatus || payload.mainIssue, 120),
    accidentSummary: sanitizeText(payload.accidentSummary || payload.shortMessage, 3000),
    injured: sanitizeText(payload.injured, 20),
    medicalAttention: sanitizeText(payload.medicalAttention || payload.needsTreatmentCoverage, 20),
    workImpact: sanitizeText(payload.workImpact || payload.missingWork, 20),
    ongoingSymptoms: sanitizeText(payload.ongoingSymptoms, 20),
    injuryDetails: sanitizeText(payload.injuryDetails, 1500),
    spokenWithLawyer: sanitizeText(payload.spokenWithLawyer, 20),
    currentlyRepresented: sanitizeText(payload.currentlyRepresented, 20),
    thirdPartyInvolved: sanitizeText(payload.thirdPartyInvolved, 20),
    additionalNotes: sanitizeText(payload.additionalNotes, 1500),
    consentTruth: Boolean(payload.consentTruth),
    consentNotLawFirm: Boolean(payload.consentNotLawFirm),
    consentToContact: Boolean(payload.consentToContact),
    sourcePage: sanitizeText(payload.sourcePage, 200) || '/',
    landingPageUrl: sanitizeText(payload.landingPageUrl, 500),
    referrer: sanitizeText(payload.referrer, 500),
    userAgent: sanitizeText(payload.userAgent, 500),
    ipHash: sanitizeText(payload.ipHash, 128),
    utmSource: sanitizeText(payload.utmSource || payload.utm_source, 120),
    utmMedium: sanitizeText(payload.utmMedium || payload.utm_medium, 120),
    utmCampaign: sanitizeText(payload.utmCampaign || payload.utm_campaign, 200),
    utmTerm: sanitizeText(payload.utmTerm || payload.utm_term, 200),
    utmContent: sanitizeText(payload.utmContent || payload.utm_content, 200),
    gclid: sanitizeText(payload.gclid, 300),
    fbclid: sanitizeText(payload.fbclid, 300),
  };

  const requiredFields = [
    'firstName',
    'accidentType',
    'accidentDate',
    'cityArea',
    'inOntario',
    'injured',
    'claimStatus'
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!data.phone && !data.email) {
    throw new Error('Missing required field: phone or email');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('A valid email address is required when email is provided.');
  }

  data.fullName = data.fullName || data.firstName;
  data.contactMethod = data.contactMethod || (data.phone && data.email ? 'Either' : data.phone ? 'Phone' : 'Email');
  data.bestTime = data.bestTime || 'Not specified';
  data.accidentSummary = data.accidentSummary || data.claimStatus;
  data.medicalAttention = data.medicalAttention || 'Not specified';
  data.workImpact = data.workImpact || 'Not specified';
  data.ongoingSymptoms = data.ongoingSymptoms || 'Not specified';
  data.spokenWithLawyer = data.spokenWithLawyer || 'Not specified';
  data.currentlyRepresented = data.currentlyRepresented || 'No';
  data.thirdPartyInvolved = data.thirdPartyInvolved || 'Not specified';
  data.consentTruth = payload.consentTruth === undefined ? true : data.consentTruth;
  data.consentNotLawFirm = payload.consentNotLawFirm === undefined ? true : data.consentNotLawFirm;
  data.consentToContact = payload.consentToContact === undefined ? true : data.consentToContact;

  if (!['Yes', 'No', 'Not sure'].includes(data.inOntario)) {
    throw new Error('Missing required field: Ontario accident yes/no');
  }

  if (!['Yes', 'No', 'Not sure'].includes(data.injured)) {
    throw new Error('Missing required field: injured yes/no');
  }

  const score = calculateLeadScore(data);
  const bucket = determineBucket(data, score);
  const status = normalizeStatus(payload.status, data);

  return {
    submittedAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    data,
    review: { score, bucket, status }
  };
}

function calculateLeadScore(data) {
  let score = 0;
  if (data.inOntario === 'Yes') score += 3;
  if (data.injured === 'Yes') score += 3;
  if (data.medicalAttention === 'Yes') score += 2;
  if (data.workImpact === 'Yes') score += 3;
  if (data.ongoingSymptoms === 'Yes') score += 2;
  if (data.thirdPartyInvolved === 'Yes') score += 3;
  if (data.spokenWithLawyer === 'No') score += 1;
  if (data.currentlyRepresented === 'No') score += 2;
  if (data.accidentSummary.split(/\s+/).filter(Boolean).length >= 12) score += 2;
  if (['Car accident', 'Truck accident', 'Motorcycle accident', 'Pedestrian accident', 'Bicycle accident', 'Slip and fall', 'Other', 'Other motor vehicle accident'].includes(data.accidentType)) score += 2;
  if (data.inOntario === 'No') score -= 10;
  if (data.currentlyRepresented === 'Yes') score -= 6;
  return score;
}

function determineBucket(data, score) {
  if (data.inOntario === 'No') return 'Outside Ontario / low priority';
  if (data.currentlyRepresented === 'Yes') return 'Already represented / low priority';
  if (score >= 11) return 'High priority review';
  if (score >= 7) return 'Qualified review';
  if (score >= 4) return 'Manual review';
  return 'Low priority review';
}

function mapSubmissionForInsert(record) {
  const { data, review } = record;

  return {
    id: record.id,
    submitted_at: record.submittedAt,
    full_name: data.fullName,
    phone: data.phone,
    email: data.email,
    contact_method: data.contactMethod,
    best_time: data.bestTime,
    accident_type: data.accidentType,
    accident_date: data.accidentDate,
    city_area: data.cityArea,
    in_ontario: data.inOntario,
    accident_summary: data.accidentSummary,
    injured: data.injured,
    medical_attention: data.medicalAttention,
    work_impact: data.workImpact,
    ongoing_symptoms: data.ongoingSymptoms,
    injury_details: data.injuryDetails || null,
    spoken_with_lawyer: data.spokenWithLawyer,
    currently_represented: data.currentlyRepresented,
    third_party_involved: data.thirdPartyInvolved,
    additional_notes: data.additionalNotes || null,
    consent_truth: data.consentTruth,
    consent_not_law_firm: data.consentNotLawFirm,
    consent_to_contact: data.consentToContact,
    source_page: data.sourcePage,
    review_score: review.score,
    review_bucket: review.bucket,
    raw_submission: record,

    first_name: data.firstName,
    phone_or_email: data.phone || data.email,
    city_region: data.cityArea,
    happened_in_ontario: data.inOntario,
    main_issue: data.claimStatus,
    needs_treatment_coverage: data.medicalAttention,
    missing_work: data.workImpact,
    short_message: data.accidentSummary,
    best_time_to_reach: data.bestTime,
    landing_page_url: data.landingPageUrl || data.sourcePage,
    referrer: data.referrer || null,
    user_agent: data.userAgent || null,
    ip_hash: data.ipHash || null,
    utm_source: data.utmSource || null,
    utm_medium: data.utmMedium || null,
    utm_campaign: data.utmCampaign || null,
    utm_term: data.utmTerm || null,
    utm_content: data.utmContent || null,
    gclid: data.gclid || null,
    fbclid: data.fbclid || null,
    status: review.status,
  };
}

function mapSubmissionForLegacyInsert(record) {
  const full = mapSubmissionForInsert(record);
  return {
    id: full.id,
    submitted_at: full.submitted_at,
    full_name: full.full_name,
    phone: full.phone,
    email: full.email,
    contact_method: full.contact_method,
    best_time: full.best_time,
    accident_type: full.accident_type,
    accident_date: full.accident_date,
    city_area: full.city_area,
    in_ontario: full.in_ontario,
    accident_summary: full.accident_summary,
    injured: full.injured,
    medical_attention: full.medical_attention,
    work_impact: full.work_impact,
    ongoing_symptoms: full.ongoing_symptoms,
    injury_details: full.injury_details,
    spoken_with_lawyer: full.spoken_with_lawyer,
    currently_represented: full.currently_represented,
    third_party_involved: full.third_party_involved,
    additional_notes: full.additional_notes,
    consent_truth: full.consent_truth,
    consent_not_law_firm: full.consent_not_law_firm,
    consent_to_contact: full.consent_to_contact,
    source_page: full.source_page,
    review_score: full.review_score,
    review_bucket: full.review_bucket,
    raw_submission: full.raw_submission
  };
}

function isSchemaCompatibilityError(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('column') || message.includes('schema cache') || message.includes('could not find');
}

export async function appendSubmission(record) {
  const supabase = getSupabaseAdminClient();
  const table = getIntakeTableName();
  const full = mapSubmissionForInsert(record);
  const { error } = await supabase
    .from(table)
    .insert(full);

  if (!error) return { mode: 'full' };

  // Safety fallback: if production has not yet received the new lead-quality
  // migration, still capture the lead durably using the original schema.
  // Attribution/status remain preserved inside raw_submission until migration runs.
  if (isSchemaCompatibilityError(error)) {
    const fallback = await supabase
      .from(table)
      .insert(mapSubmissionForLegacyInsert(record));

    if (!fallback.error) return { mode: 'legacy_fallback' };

    throw new Error(`Unable to store the review request: ${fallback.error.message}`);
  }

  throw new Error(`Unable to store the review request: ${error.message}`);
}
