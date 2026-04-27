import { IntakeModal } from '@/components/IntakeModal';
import Link from 'next/link';

export const metadata = {
  title: 'Income Replacement Benefit Denied in Ontario | Know Your Options',
  description:
    'If your auto insurer denied your Income Replacement Benefit after an Ontario accident, you have the right to dispute it. Learn deadlines, dispute steps, and how to get a free professional review.',
};

export default function DeniedIRBPage() {
  return (
    <>
      
      <main>
        <div className="container">
          <div className="page-shell">

            <div className="page-head">
              <p className="eyebrow">Accident Benefits — Income Replacement</p>
              <h1>Your Income Replacement Benefit was denied. Here is what to do.</h1>
              <p className="page-copy">
                If your auto insurer has denied, reduced, or stopped your Income Replacement Benefit (IRB)
                after an Ontario accident, you have legal rights — including the right to dispute that decision.
                The process has strict deadlines. Missing them can permanently end your ability to claim.
              </p>
            </div>

            <div className="page-body">

              <h2>What is the Income Replacement Benefit?</h2>
              <p>
                The Income Replacement Benefit is a no-fault accident benefit under Ontario's Statutory
                Accident Benefits Schedule (SABS). It is paid by your <em>own</em> auto insurer —
                not the other driver's — regardless of who was at fault.
              </p>
              <p>
                If you were employed or self-employed at the time of your accident and your injuries
                prevent you from returning to work, your insurer is required to pay 70% of your gross
                weekly pre-accident income. The standard policy maximum is $400 per week. This can be
                higher if you purchased optional enhanced coverage.
              </p>
              <p>
                IRB begins after a 7-day waiting period. It can continue for up to 104 weeks while you
                cannot perform your pre-accident job. After 104 weeks the test changes: you must be
                unable to work in <em>any</em> capacity that your education and experience would allow.
              </p>

              <h2>Why insurers deny Income Replacement Benefit claims</h2>
              <p>Denials are common. These are the most frequent reasons insurers give:</p>
              <ul>
                <li>
                  <strong>You do not meet the disability test.</strong> The insurer argues you can still
                  do your pre-accident job, usually based on an Independent Medical Examination (IME)
                  it arranged — which often contradicts your own doctors.
                </li>
                <li>
                  <strong>Disputed income or employment status.</strong> The insurer challenges your
                  pre-accident earnings, especially for self-employed people, gig workers, or those
                  with irregular income.
                </li>
                <li>
                  <strong>Late application.</strong> Accident benefit applications must generally be
                  submitted within 30 days of the accident. Exceptions exist, but late applications
                  are routinely denied at first.
                </li>
                <li>
                  <strong>The 104-week cutover.</strong> After two years of receiving IRB, the disability
                  test becomes significantly harder to meet. Insurers frequently stop payments at
                  this point.
                </li>
                <li>
                  <strong>Insurer-ordered assessments.</strong> Insurers can require you to attend
                  their own assessments. If you miss one, they can suspend or terminate your benefit.
                </li>
              </ul>

              <h2>Deadlines you cannot miss</h2>
              <p>
                Ontario's accident benefits process has hard cutoff dates that are rarely extendable.
              </p>
              <ul>
                <li>
                  <strong>30 days from the accident</strong> — notify your insurer and request
                  an application form.
                </li>
                <li>
                  <strong>30 days from the denial notice</strong> — request an internal review
                  from your insurer. This step is mandatory before going to the tribunal.
                </li>
                <li>
                  <strong>30 days after the internal review response</strong> — or 30 days after
                  the insurer's response deadline passes — to file at the Licence Appeal Tribunal (LAT).
                </li>
                <li>
                  <strong>2 years from the denial date</strong> — the outer limitation period for
                  a LAT application. Do not wait — the internal review step must come first.
                </li>
              </ul>
              <p>
                If you are unsure where you stand in this timeline, do not delay. A missed step
                usually cannot be recovered.
              </p>

              <h2>Your dispute options</h2>
              <p>There are three stages to disputing a denied IRB in Ontario:</p>
              <ul>
                <li>
                  <strong>Step 1 — Internal review.</strong> You write to your insurer requesting
                  a formal review of their decision. They have 30 days to respond. This is a
                  required first step before the tribunal.
                </li>
                <li>
                  <strong>Step 2 — Licence Appeal Tribunal (LAT).</strong> If the internal review
                  fails or the insurer does not respond, you can apply to the LAT — an independent
                  government tribunal that decides accident benefit disputes in Ontario. Most cases
                  are resolved through written submissions.
                </li>
                <li>
                  <strong>Step 3 — Appeal or judicial review.</strong> If the LAT rules against
                  you, further options exist in limited circumstances. A licensed professional can
                  advise whether this applies to your situation.
                </li>
              </ul>
              <p>
                At any stage, you can be represented by a paralegal or accident benefits lawyer.
                Many work on contingency — no upfront cost to you.
              </p>

              <h2>What a free review with us looks at</h2>
              <p>
                When you submit a review through Ontario Accident Review, your information is reviewed
                for common Ontario accident-benefits issues. The review is not legal advice. We look at:
              </p>
              <ul>
                <li>Whether a denial, delay, or reduction may be worth a closer look</li>
                <li>Whether income replacement, treatment, or other benefit questions appear relevant</li>
                <li>What practical next steps may be worth considering</li>
                <li>Whether speaking with a legal professional may make sense</li>
              </ul>
              <p>
                There is no cost and no obligation. You do not need to provide your insurance documents
                or policy number to start. The review takes about two minutes.
              </p>

              <div style={{
                marginTop: '3rem',
                padding: '2rem',
                background: '#0e1c30',
                borderRadius: '8px',
                borderLeft: '4px solid #cba72f',
              }}>
                <p style={{
                  color: '#cba72f',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  marginTop: 0,
                  marginBottom: '0.75rem',
                }}>
                  Think your denial may be wrong?
                </p>
                <h3 style={{
                  color: '#fff',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  marginTop: 0,
                  marginBottom: '0.75rem',
                }}>
                  Get a free assessment — no insurance details required.
                </h3>
                <p style={{ color: '#8fa3be', marginBottom: '1.5rem', marginTop: 0 }}>
                  If you were injured in an Ontario accident and your income replacement benefit
                  was denied or reduced, you may have options you have not been told about.
                </p>
                <Link href="/#intake" className="button">
                  Start your free review
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
      
      <IntakeModal />
    </>
  );
}
