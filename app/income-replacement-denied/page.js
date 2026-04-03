import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
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
      <SiteHeader />
      <main>
        <div className="container">
          <div className="page-shell">

            <div className="page-head">
              <p className="eyebrow">Accident Benefits — Income Replacement</p>
              <h1>Your Income Replacement Benefit was denied. Here is what to do.</h1>
              <p className="page-copy">
                If your auto insurer has denied, reduced, or stopped your Income Replacement Benefit (IRB)
                after an Ontario accident, you have legal rights — including the right to dispute the decision.
                The process has strict deadlines. Missing them can permanently end your ability to claim.
              </p>
            </div>

            <div className="page-body">

              <h2>What is the Income Replacement Benefit?</h2>
              <p>
                The Income Replacement Benefit is a no-fault accident benefit provided under Ontario's
                Statutory Accident Benefits Schedule (SABS). It is paid by your <em>own</em> auto insurer —
                not the other driver's — regardless of who caused the accident.
              </p>
              <p>
                If you were employed or self-employed at the time of your accident and your injuries prevent
                you from returning to work, your insurer is required to pay 70% of your gross weekly
                pre-accident income. The standard policy maximum is $400 per week, though this can be higher
                if you purchased optional enhanced coverage.
              </p>
              <p>
                IRB begins after a 7-day waiting period and can continue for up to 104 weeks while you
                cannot perform your pre-accident employment. After 104 weeks, the test changes — you must
                be unable to do <em>any</em> suitable employment.
              </p>

              <h2>Why insurers deny Income Replacement Benefit claims</h2>
              <p>Denials are common. These are the most frequent reasons insurers give:</p>
              <ul>
                <li>
                  <strong>You do not meet the disability test.</strong> The insurer argues you are still
                  capable of performing your pre-accident job duties, usually based on an Independent
                  Medical Examination (IME) it arranged.
                </li>
                <li>
                  <strong>Disputed income or employment status.</strong> The insurer challenges your
                  pre-accident earnings, especially for self-employed people, gig workers, or those with
                  irregular income.
                </li>
                <li>
                  <strong>Late application.</strong> Accident benefit applications must generally be
                  submitted within 30 days of the accident. Late applications can be denied, though
                  exceptions exist.
                </li>
                <li>
                  <strong>The insurer's IME contradicts your treating doctors.</strong> Insurers often
                  rely on their own assessors over your family doctor or specialists. This is
                  challengeable.
                </li>
                <li>
                  <strong>No optional income replacement coverage.</strong> The standard policy pays up
                  to $400/week. If your income was higher and you did not purchase optional benefits,
                  the insurer may deny the difference — though the base entitlement still applies.
                </li>
                <li>
                  <strong>Benefit stopped after 104 weeks.</strong> The insurer reassesses eligibility
                  using a stricter "complete inability" test and concludes you can work in some capacity.
                </li>
              </ul>

              <h2>Deadlines you cannot miss</h2>
              <p>
                Ontario's accident benefits system has hard cutoff dates. Unlike most civil claims, these
                deadlines are often not extendable.
              </p>
              <ul>
                <li>
                  <strong>30 days from the accident</strong> — to notify your insurer and request an
                  application form.
                </li>
                <li>
                  <strong>30 days from the denial notice</strong> — to request an internal review from
                  your insurer. This is a mandatory first step before you can go to the tribunal.
                </li>
                <li>
                  <strong>30 days after the insurer's internal review response</strong> — or 30 days
                  after their response deadline passes — to apply to the Licence Appeal Tribunal (LAT).
                </li>
                <li>
                  <strong>2 years from the date of the denial</strong> — the outer limitation period
                  to file a LAT application. Do not wait this long — the internal review step must come
                  first and takes time.
                </li>
              </ul>
              <p>
                If you are unsure where you are in this timeline, do not wait. A missed step cannot
                always be recovered.
              </p>

              <h2>Your options after a denial</h2>
              <p>There are three stages to disputing a denied IRB in Ontario:</p>
              <ul>
                <li>
                  <strong>Step 1 — Internal review.</strong> You write to your insurer requesting a
                  formal internal review of the denial. The insurer has 30 days to respond. This step
                  is required before you can go to the tribunal.
                </li>
                <li>
                  <strong>Step 2 — Licence Appeal Tribunal (LAT).</strong> If the internal review
                  fails or the insurer does not respond in time, you can apply to the LAT — an
                  independent government tribunal that adjudicates accident benefit disputes in Ontario.
                  Most cases are heard by written submissions, though hearings are available.
                </li>
                <li>
                  <strong>Step 3 — Appeal or judicial review.</strong> If the LAT rules against you,
                  there is a further appeal process available in limited circumstances. A licensed
                  legal professional can advise on whether it applies to your situation.
                </li>
              </ul>
              <p>
                At any stage, you have the right to be represented by a paralegal or lawyer who
                specializes in accident benefits. Many work on a contingency basis — meaning no upfront
                cost to you.
              </p>

              <h2>What a free review with us looks at</h2>
              <p>
                When you submit a review through Ontario Accident Review, a licensed Ontario legal
                professional assesses your specific situation — not a generic checklist. We look at:
              </p>
              <ul>
                <li>Whether the insurer's stated reason for denial is legally supportable</li>
                <li>Whether the disability test was applied correctly to your type of work</li>
                <li>Which deadlines are still open and which steps remain available to you</li>
                <li>Whether the denial is worth pursuing and what the realistic path forward looks like</li>
              </ul>
              <p>
                There is no cost and no obligation. You do not need to provide insurance documents or
                policy numbers to get started. The review takes about two minutes to complete.
              </p>

              <div className="page-cta-block">
                <p className="page-cta-label">Think your denial may be wrong?</p>
                <h3>Get a free assessment of your situation — no insurance details required.</h3>
                <p>
                  If you were injured in an Ontario accident and your income replacement benefit was
                  denied or reduced, you may have options you have not been told about. Start here.
                </p>
                <Link href="/#how-it-works" className="btn-primary">
                  Start your free review
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <IntakeModal />
    </>
  );
}
