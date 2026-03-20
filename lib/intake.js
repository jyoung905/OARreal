import crypto from 'node:crypto';
import { getIntakeTableName, getSupabaseAdminClient } from '@/lib/supabase-server';

const sanitizeText = (value, limit) => String(value || '').trim().slice(0, limit);

export function sanitizeLead(payload = {}) {
  const data = {
    fullName: sanitizeText(payload.fullName, 120),
    phone: sanitizeText(payload.phone, 40),
    email: sanitizeText(payload.email, 200),
    contactMethod: sanitizeText(payload.contactMethod, 40),
    bestTime: sanitizeText(payload.bestTime, 40),
    accidentType: sanitizeText(payload.accidentType, 80),
    accidentDate: sanitizeText(payload.accidentDate, 40),
    cityArea: sanitizeText(payload.cityArea, 120),
    inOntario: sanitizeText(payload.inOntario, 20),
    accidentSummary: sanitizeText(payload.accidentSummary, 3000),
    injured: sanitizeText(payload.injured, 20),
    medicalAttention: sanitizeText(payload.medicalAttention, 20),
    workImpact: sanitizeText(payload.workImpact, 20),
    ongoingSymptoms: sanitizeText(payload.ongoingSymptoms, 20),
    injuryDetails: sanitizeText(payload.injuryDetails, 1500),
    spokenWithLawyer: sanitizeText(payload.spokenWithLawyer, 20),
    currentlyRepresented: sanitizeText(payload.currentlyRepresented, 20),
    thirdPartyInvolved: sanitizeText(payload.thirdPartyInvolved, 20),
    additionalNotes: sanitizeText(payload.additionalNotes, 1500),
    consentTruth: Boolean(payload.consentTruth),
    consentNotLawFirm: Boolean(payload.consentNotLawFirm),
    consentToContact: Boolean(payload.consentToContact),
    sourcePage: sanitizeText(payload.sourcePage, 200) || '/'
  };

  const requiredFields = [
    'fullName',
    'phone',
    'email',
    'contactMethod',
    'bestTime',
    'accidentType',
    'accidentDate',
    'cityArea',
    'inOntario',
    'accidentSummary',
    'injured',
    'medicalAttention',
    'workImpact',
    'ongoingSymptoms',
    'spokenWithLawyer',
    'currentlyRepresented',
    'thirdPartyInvolved'
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!data.consentTruth || !data.consentNotLawFirm || !data.consentToContact) {
    throw new Error('All consent checkboxes are required.');
  }

  const score = calculateLeadScore(data);
  const bucket = determineBucket(data, score);

  return {
    submittedAt: new Date().toISOString(),
    id: crypto.randomUUID(),
    data,
    review: { score, bucket }
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
  if (['Car accident', 'Truck accident', 'Motorcycle accident', 'Pedestrian accident', 'Bicycle accident', 'Slip and fall', 'Other'].includes(data.accidentType)) score += 2;
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
    raw_submission: record
  };
}

export async function appendSubmission(record) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from(getIntakeTableName())
    .insert(mapSubmissionForInsert(record));

  if (error) {
    throw new Error(`Unable to store the review request: ${error.message}`);
  }
}
