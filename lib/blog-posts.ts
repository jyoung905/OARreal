export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  sections: { heading?: string; body: string; type?: 'callout' | 'list' | 'paragraph' }[];
  oldHtmlPath: string; // for redirect mapping
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ontario-accident-deadlines',
    title: 'The 5 Deadlines Ontario Accident Victims Miss — And What Happens When They Do',
    description: "Missing a single deadline can permanently eliminate benefits you're legally entitled to under Ontario's accident benefits framework. Here's what to know.",
    category: 'Deadlines & Timelines',
    readTime: '8 min read',
    oldHtmlPath: '/blog-deadlines.html',
    sections: [
      {
        type: 'paragraph',
        body: "Ontario's accident benefits system is governed by the Statutory Accident Benefits Schedule (SABS) — a dense piece of legislation with hard deadlines baked in at every step. Unlike other legal matters where a late filing might be excused, missing a SABS deadline can mean the permanent loss of benefits you're entitled to. No extension. No appeal. No second chance.",
      },
      {
        type: 'paragraph',
        body: "Here are the five deadlines Ontario accident victims most commonly miss, and what the consequences are.",
      },
      {
        heading: '1. The 7-Day Notice Requirement',
        type: 'callout',
        body: 'When: Within 7 days of the accident. What: Notify your own insurer that an accident occurred.\n\nAfter an accident, you are required to notify your automobile insurer as soon as practicable, and in any event within 7 days. This doesn\'t mean filing a claim — it means providing notice that the accident occurred. Many people wait to see how injuries develop before contacting anyone. That delay can cost you.\n\nFailing to provide timely notice doesn\'t automatically bar your claim, but it can be used by your insurer to reduce or deny benefits if they can show they were prejudiced by the late notice.',
      },
      {
        heading: '2. The 30-Day Application Deadline',
        type: 'callout',
        body: 'When: Within 30 days of receiving the OCF forms. What: Return completed accident benefit application forms.\n\nOnce you notify your insurer, they are required to send you application forms (OCF forms) within 10 business days. You then have 30 days to return the completed forms. Missing this deadline gives the insurer grounds to deny your claim entirely — not just delay it.\n\nPeople often hold off on completing the forms because they\'re dealing with recovery, don\'t understand the paperwork, or are waiting to see if the injuries resolve on their own. That\'s a costly mistake.',
      },
      {
        heading: '3. The 104-Week Transition Period for Income Replacement',
        type: 'callout',
        body: "When: 2 years after the accident. What: Stricter test for income replacement benefits applies.\n\nIncome Replacement Benefits (IRB) initially pay if you cannot perform the \"essential tasks\" of your pre-accident job. After 104 weeks (2 years), the test changes — you must be unable to perform any job for which you are \"reasonably suited by education, training, or experience.\" This is a significantly higher bar, and many claimants lose their IRB at this point without understanding why.\n\nIf you're approaching the 104-week mark and still have injury-related work limitations, you should have your situation reviewed before the transition happens — not after.",
      },
      {
        heading: '4. The 2-Year Limitation Period for Tort Claims',
        type: 'callout',
        body: "When: 2 years from date of accident. What: File a tort (lawsuit) claim against the at-fault party.\n\nIn addition to accident benefits through your own insurer, you may have the right to sue the at-fault party for damages (pain and suffering, future care costs, lost income beyond what SABS covers). This right expires 2 years from the date of the accident under Ontario's Limitations Act.\n\nMissing this deadline is permanent. There are narrow exceptions for minors and certain cases of incapacity, but for most adults, the 2-year window is absolute.",
      },
      {
        heading: '5. The 2-Year Deadline for Applying to FSRA Dispute Resolution',
        type: 'callout',
        body: "When: 2 years from the insurer's refusal or denial. What: Apply to FSRA for dispute resolution if insurer denied a benefit.\n\nIf your insurer denies, delays, or reduces a benefit, Ontario has a formal dispute resolution process through FSRA (Financial Services Regulatory Authority of Ontario). You must apply within 2 years of the refusal. Waiting out the dispute or hoping the situation resolves on its own means losing your right to formally challenge the denial.",
      },
    ],
  },
  {
    slug: 'ontario-sabs-explained',
    title: "What Ontario's SABS Actually Covers: A Plain-Language Breakdown",
    description: "The Statutory Accident Benefits Schedule is the law that governs what your insurer must pay after an accident in Ontario. Most claimants never see it. Here's what it actually means for your situation.",
    category: 'Insurance Rights',
    readTime: '6 min read',
    oldHtmlPath: '/blog-sabs.html',
    sections: [
      {
        type: 'paragraph',
        body: "The Statutory Accident Benefits Schedule — known as SABS — is an Ontario regulation that defines the minimum benefits every licensed driver must be able to claim from their own auto insurer after an accident, regardless of who was at fault. It's part of every standard Ontario auto insurance policy, whether or not the policyholder knows it.",
      },
      {
        type: 'paragraph',
        body: "The problem is that SABS is long, technical, and full of defined terms that affect eligibility in ways most people don't anticipate. Insurers understand it thoroughly. Most claimants do not. This article is a plain-language summary of what SABS covers and what typically gets missed.",
      },
      {
        heading: 'Income Replacement Benefits (IRB)',
        type: 'paragraph',
        body: "If you can't work due to accident injuries, IRB pays 70% of your pre-accident gross weekly income, up to a maximum of $400/week under standard coverage (optional enhanced benefits can raise this). The first 104 weeks use a 'unable to do your own job' test; after that, the test tightens.",
      },
      {
        heading: 'Medical & Rehabilitation Benefits',
        type: 'paragraph',
        body: "Covers treatment, therapy, and rehabilitation costs not covered by OHIP or your extended health benefits. The amount available depends on your injury category: minor injuries have a capped limit, non-minor injuries have a higher limit, and catastrophic injuries have the highest limit.",
      },
      {
        heading: 'Attendant Care Benefits',
        type: 'paragraph',
        body: "If your injuries require someone to help you with daily tasks — bathing, dressing, mobility — SABS requires your insurer to contribute to those costs. The benefit amount and duration depend on the severity of your injury category.",
      },
      {
        heading: 'Caregiver Benefits',
        type: 'paragraph',
        body: "If you were the primary caregiver for a child or dependent prior to the accident and can no longer provide that care, you may be entitled to compensation for replacement care costs. This benefit was reduced in 2016 under standard coverage and now applies mainly to catastrophic injuries under the standard policy.",
      },
      {
        heading: 'Housekeeping & Home Maintenance',
        type: 'paragraph',
        body: "Like caregiver benefits, this was reduced in 2016 and now applies under standard policies mainly to catastrophic injuries. If you purchased an optional enhancement, it may be available for non-catastrophic injuries as well.",
      },
      {
        heading: 'The Injury Category Matters More Than You Think',
        type: 'paragraph',
        body: "One of the most consequential aspects of SABS is that the available benefits depend heavily on how your injury is classified. Minor Injury (MIG): Soft tissue injuries like sprains, strains, and whiplash. These are subject to a $3,500 treatment cap, which is often exhausted quickly. Non-Catastrophic: More serious injuries that don't meet the catastrophic threshold. Higher limits apply. Catastrophic Impairment: The most serious category — paraplegia, severe brain injury, loss of limb, etc. The highest limits apply and most benefits that were removed in 2016 are reinstated.\n\nInsurers frequently assess injuries as minor when a claimant believes — and medical evidence may support — that they are more severe. Challenging an injury classification is one of the most common dispute types in Ontario accident benefits.",
      },
      {
        heading: 'What SABS Does Not Cover',
        type: 'paragraph',
        body: "SABS covers benefits from your own insurer. It does not compensate you for pain and suffering, loss of enjoyment of life, or non-economic losses. Those are tort damages, claimed through a separate lawsuit against the at-fault party. There are threshold requirements in Ontario before non-economic tort damages can be claimed — another area where many claimants lose entitlements without understanding why.",
      },
      {
        heading: 'Bottom Line',
        type: 'paragraph',
        body: "Most people who have been in an Ontario accident are entitled to more than they receive. The gap between what's available and what gets paid usually comes down to one thing: the claimant not knowing what to ask for. A free review can help identify exactly where that gap exists in your situation.",
      },
    ],
  },
  {
    slug: 'should-you-accept-first-settlement-offer',
    title: "Should You Accept the First Offer? What Most Claimants Don't Know",
    description: "Initial settlement offers from Ontario insurers rarely reflect the full value of a claim. Here's what you're agreeing to when you sign — and what you're giving up.",
    category: 'Settlements',
    readTime: '7 min read',
    oldHtmlPath: '/blog-settlement.html',
    sections: [
      {
        type: 'paragraph',
        body: "After an accident in Ontario, at some point your insurer — or the at-fault driver's insurer — will make you an offer. It might come weeks after the accident or years later. It might seem generous in the moment. And almost always, it's less than what you would be entitled to if you fully understood your situation.",
      },
      {
        heading: 'What Is a Settlement Offer, Exactly?',
        type: 'callout',
        body: "A settlement offer is a proposal to resolve your claim — or a specific part of it — in exchange for a payment. When you accept and sign a release, you are permanently giving up the right to make any further claim related to that accident for the categories covered by the release.\n\nImportant: In Ontario, once you sign a full and final release, you cannot re-open the claim — even if you later discover your injuries are more serious than initially assessed, or that you were entitled to additional benefits. Signing is final.",
      },
      {
        type: 'paragraph',
        body: "There are two types of settlement you may encounter: Accident Benefits Settlement: Resolves your claims against your own insurer under SABS. This can be global (all benefits) or limited to specific heads of benefit. Tort Settlement: Resolves your lawsuit against the at-fault driver for non-economic damages like pain and suffering, future income loss, and future care beyond SABS limits.\n\nThese are separate settlements, and you can settle one without settling the other. Many claimants don't realize this and inadvertently settle everything at once.",
      },
      {
        heading: 'Why First Offers Are Almost Always Low',
        type: 'paragraph',
        body: "Insurers are structured to minimize payouts. This is not a conspiracy — it's the basic economics of the insurance industry. Adjusters are evaluated on claim cost management, and initial offers are typically calibrated to close files quickly at the lowest feasible amount.\n\nSeveral structural factors work against claimants: Offers often come before the full extent of injuries is known. Chronic conditions, psychological impacts, and long-term functional limitations frequently don't become clear for months or years. An offer might cover current medical bills but underestimate future treatment, attendant care, or lost earning capacity. Most people accept an offer without knowing whether they're entitled to more under SABS or tort. After a serious accident, many people just want closure — and insurers know that.",
      },
      {
        heading: 'What You Should Know Before Accepting',
        type: 'list',
        body: "Has your injury been properly classified under SABS? (Minor, non-catastrophic, or catastrophic?)\nHave you claimed all the benefits you're entitled to under SABS — income replacement, attendant care, rehabilitation, housekeeping?\nDoes the settlement cover only accident benefits, or does it also release your tort claim?\nHas the full scope of your future care needs been assessed?\nAre there any ongoing disputes with your insurer that haven't been resolved?\nIs the 2-year tort limitation period still open?",
      },
      {
        heading: 'The Bottom Line',
        type: 'paragraph',
        body: "You are not obligated to accept the first offer — or any offer — on any timeline. The pressure to settle quickly is real, but the consequences of settling for too little are permanent. A free review can help you understand exactly what your claim is worth before you make that decision.",
      },
    ],
  },
  {
    slug: 'income-replacement-rehab-benefits-ontario',
    title: "Income Replacement & Rehab Benefits: What You're Entitled To After an Ontario Accident",
    description: "Under Ontario's SABS, accident victims are entitled to income replacement and rehabilitation benefits — but the rules are more detailed than most people realize.",
    category: 'Medical Benefits',
    readTime: '7 min read',
    oldHtmlPath: '/blog-irb.html',
    sections: [
      {
        type: 'paragraph',
        body: "When you're injured in an accident in Ontario, the Statutory Accident Benefits Schedule (SABS) provides a range of benefits designed to help you recover financially. Two of the most significant — and most misunderstood — are Income Replacement Benefits (IRB) and rehabilitation benefits. Many accident victims either don't claim them at all or accept less than they're entitled to.",
      },
      {
        heading: 'What Are Income Replacement Benefits (IRB)?',
        type: 'callout',
        body: "If you were employed or self-employed at the time of your accident and your injuries prevent you from returning to work, you may be entitled to Income Replacement Benefits. IRB replaces a portion of your pre-accident income on a weekly basis while you're unable to work.\n\nStandard Amount: 70% of your gross weekly income, up to a maximum of $400 per week under the standard benefit level. Optional Higher Limits: If you purchased optional benefits, limits may be $600, $800, or $1,000 per week.",
      },
      {
        heading: 'The Two-Stage Test for IRB Eligibility',
        type: 'list',
        body: "First 104 weeks: You must be unable to perform the essential tasks of your own occupation.\nAfter 104 weeks: You must be unable to perform any occupation for which you are reasonably suited by education, training, or experience.",
      },
      {
        heading: 'Non-Earner Benefits: If You Were Not Working',
        type: 'paragraph',
        body: "If you were not employed at the time of the accident, you may instead qualify for Non-Earner Benefits (NEB). NEB pays $185 per week if you suffer a complete inability to carry on a normal life as a result of your injuries.",
      },
      {
        heading: 'Rehabilitation Benefits Under SABS',
        type: 'paragraph',
        body: "Medical & Rehabilitation: Covers treatments, assessments, and services related to your injury. Attendant Care: Covers the cost of personal care assistance if your injuries require help with daily activities.\n\nUnder standard SABS limits, medical and rehabilitation benefits are capped at $65,000 for non-catastrophic injuries and $1,000,000 for catastrophic injuries.",
      },
      {
        heading: "What Counts as a 'Catastrophic' Injury?",
        type: 'list',
        body: "Paraplegia or quadriplegia\nAmputation of an arm or leg\nSevere brain injury meeting specific criteria\nTotal loss of vision in both eyes\nA combination of impairments resulting in a whole person impairment (WPI) of 55% or more",
      },
      {
        heading: 'Common Problems With IRB and Rehab Claims',
        type: 'list',
        body: "Insurers dispute the extent of your injuries and deny or cap benefits early\nRepeated independent medical examinations (IMEs) to challenge your claim\nIRB reduced based on income from other sources (CPP, EI, etc.)\nRehabilitation expenses denied as \"not reasonable and necessary\"\nBenefits cut off at the 104-week transition without proper reassessment",
      },
      {
        type: 'paragraph',
        body: "If your insurer has denied, reduced, or delayed any of these benefits, Ontario's dispute resolution system through FSRA provides a formal mechanism to challenge that decision within 2 years of the refusal.",
      },
    ],
  },
  {
    slug: 'ontario-insurer-dispute-process',
    title: 'When Your Insurer Denies Your Claim: The Ontario Dispute Process Explained',
    description: "A denial from your insurer is not the final word. Ontario has a structured dispute resolution system — but you need to know how it works and act before your time runs out.",
    category: 'Insurer Disputes',
    readTime: '8 min read',
    oldHtmlPath: '/blog-dispute.html',
    sections: [
      {
        type: 'paragraph',
        body: "Receiving a denial letter from your insurance company can feel like the end of the road. In Ontario, it isn't. The accident benefits system comes with a formal dispute resolution process administered by the Financial Services Regulatory Authority of Ontario (FSRA) — but it's only available to those who understand it exists and act before the deadline.",
      },
      {
        heading: 'Why Insurers Deny Claims',
        type: 'list',
        body: "The insurer disputes whether your injuries meet the threshold for a particular benefit\nAn independent medical examination (IME) arranged by the insurer concluded your injuries are less severe than claimed\nThe insurer alleges a procedural issue — missed forms, late notice, or missing documentation\nThe insurer argues the treatment is not \"reasonable and necessary\" under SABS\nThe insurer believes your injuries pre-dated the accident",
      },
      {
        heading: 'The 2-Year Deadline to Apply for Dispute Resolution',
        type: 'callout',
        body: "Critical Deadline: You must apply to FSRA for dispute resolution within 2 years of the date the insurer refused, suspended, or terminated a benefit. Missing this deadline eliminates your right to formally dispute the denial.\n\nThis is not a soft deadline. Once 2 years have passed from the insurer's refusal, your right to challenge is gone. Many claimants assume they can dispute a denial whenever it's convenient — this is incorrect.",
      },
      {
        heading: 'Step 1: Internal Review Request',
        type: 'paragraph',
        body: "Before going to FSRA, you have the option to request an internal review from your insurer within 10 business days of receiving a denial. The insurer must provide a written decision on the internal review. While this step is not mandatory, it can sometimes resolve straightforward disputes without formal proceedings.\n\nHowever, an internal review does not pause the 2-year FSRA deadline. If you request an internal review and the insurer upholds the denial, you still must apply to FSRA within 2 years of the original denial.",
      },
      {
        heading: 'Step 2: FSRA Dispute Resolution',
        type: 'paragraph',
        body: "The Financial Services Regulatory Authority of Ontario administers the accident benefits dispute resolution process. There are two main dispute resolution streams: Mediation: A neutral mediator helps both parties reach an agreement. This is non-binding — either party can reject the outcome. Arbitration: If mediation fails or is waived, an arbitrator makes a binding decision. The arbitrator has full authority to award the disputed benefit, plus interest and costs.",
      },
      {
        heading: 'What to Do if Your Claim Was Denied',
        type: 'list',
        body: "Note the date of the denial letter — your 2-year deadline starts from that date\nRead the denial carefully and identify the stated reason\nGather any medical or other evidence that contradicts the insurer's position\nConsider whether an internal review is appropriate, but don't let it distract from the FSRA deadline",
      },
    ],
  },
  {
    slug: 'fault-accident-benefits-ontario',
    title: "At-Fault vs. Not-At-Fault: How Fault Affects Your Accident Benefits in Ontario",
    description: "Ontario uses a no-fault system for accident benefits — but fault still matters. Here's what the distinction means for your benefits, your right to sue, and your future insurance rates.",
    category: 'Motor Vehicle',
    readTime: '6 min read',
    oldHtmlPath: '/blog-fault.html',
    sections: [
      {
        type: 'paragraph',
        body: "One of the most common misconceptions about Ontario car accidents is that fault determines whether you can receive accident benefits. It doesn't — at least not directly. Ontario operates under a \"no-fault\" accident benefits system, which means you can access benefits through your own insurer regardless of who caused the crash.",
      },
      {
        heading: "What 'No-Fault' Actually Means in Ontario",
        type: 'callout',
        body: "When Ontarians say the province has a \"no-fault\" system, they're referring specifically to accident benefits — the income replacement, medical, rehabilitation, and other benefits you receive from your own insurer after an accident. These benefits are available to you whether you were at fault or not.\n\nKey point: You claim accident benefits through your own insurer, not through the at-fault driver's insurer. This is true even if you were the one who caused the accident.",
      },
      {
        heading: 'How Fault Is Determined in Ontario',
        type: 'paragraph',
        body: "Fault in Ontario is determined under the Fault Determination Rules — a regulation under the Insurance Act that insurers are required to apply consistently. These rules set out specific accident scenarios and assign fault percentages ranging from 0% to 100%.",
      },
      {
        heading: 'Common Fault Determinations',
        type: 'list',
        body: "A driver rear-ending another vehicle: typically 100% at fault\nA driver making a left turn struck by oncoming traffic: typically 100% at fault\nTwo vehicles collide in an intersection: fault may be shared (50/50)\nA vehicle struck while properly stopped: typically 0% at fault\nSingle-vehicle accidents: typically 100% at fault",
      },
      {
        heading: 'How Fault Affects Your Right to Sue',
        type: 'callout',
        body: "Threshold requirement: To sue for general damages, your injuries must be classified as \"serious and permanent\" — a permanent impairment of an important physical, mental, or psychological function. Minor injuries under Ontario's Minor Injury Guideline (MIG) typically don't meet this bar.\n\nIf you were not at fault (or only partially at fault), you have the right to bring a tort claim against the at-fault driver. If you were 100% at fault, your right to sue the other driver is eliminated. Partial fault reduces the damages you can claim proportionally.",
      },
      {
        heading: 'The Minor Injury Guideline (MIG)',
        type: 'paragraph',
        body: "Ontario introduced the Minor Injury Guideline to manage claims involving sprains, strains, whiplash-associated disorders, and other minor soft-tissue injuries. Under the MIG, treatment costs are capped at $3,500, regardless of how much treatment is actually needed.\n\nInsurers frequently apply the MIG to limit their exposure, and claimants are often placed within MIG limits without full consideration of whether they actually qualify. If your injuries have led to ongoing problems beyond what's covered by the $3,500 cap, you may be able to argue you fall outside the MIG — but this typically requires medical support.",
      },
      {
        heading: 'Key Takeaways on Fault and Benefits',
        type: 'list',
        body: "You are entitled to accident benefits through your own insurer regardless of fault\nFault determines whether you can sue the other driver for additional damages\nOntario's Fault Determination Rules govern how fault is assigned — this can be challenged\nBeing placed under the Minor Injury Guideline limits your treatment coverage — you may be able to challenge this classification\nA fault determination can be disputed separately from your benefits claim",
      },
    ],
  },
  {
    slug: 'slip-and-fall-ontario-occupiers-liability',
    title: "Slip and Fall in Ontario: How the Occupiers' Liability Act Affects Your Claim",
    description: "Slip and fall accidents in Ontario are governed by the Occupiers' Liability Act — a law that places a legal duty of care on property owners. Understanding your rights before you approach an insurer or a property owner can make a significant difference.",
    category: 'Slip & Fall',
    readTime: '7 min read',
    oldHtmlPath: '/blog-slip.html',
    sections: [
      {
        type: 'paragraph',
        body: "Every year, thousands of Ontarians are injured in slip and fall accidents on someone else's property — in parking lots, grocery stores, on icy sidewalks, in apartment buildings, and at public facilities. Many of those people don't pursue a claim because they assume it's their own fault, that nothing can be done, or that the process is too complicated.",
      },
      {
        heading: "Who Is an 'Occupier' Under Ontario Law?",
        type: 'list',
        body: "Property owners (residential and commercial)\nTenants and leaseholders in control of the premises\nBusinesses operating from leased space\nMunicipalities and public agencies (for sidewalks, parks, public buildings)\nContractors managing or maintaining a property",
      },
      {
        heading: "The Duty of Care Under the Occupiers' Liability Act",
        type: 'callout',
        body: "Section 3 of the Occupiers' Liability Act states that an occupier owes a duty to take such care as in all the circumstances is reasonable to see that persons entering the premises are reasonably safe while on the premises.\n\nWhat this means in practice: The occupier doesn't have to make their property perfectly safe — they have to take reasonable steps under the circumstances. What's \"reasonable\" depends on factors like the type of property, who is expected to use it, the nature of the hazard, and how quickly the occupier could have become aware of the problem.",
      },
      {
        heading: 'What You Need to Prove in a Slip and Fall Claim',
        type: 'list',
        body: "The hazard existed — there was a dangerous condition on the property\nThe occupier knew or should have known about the hazard\nThe occupier failed to act reasonably despite knowing about the hazard\nThe hazard caused your injury\nYou suffered actual damages — medical expenses, lost income, pain and suffering",
      },
      {
        heading: 'Municipal Claims: Special Rules Apply',
        type: 'callout',
        body: "If your slip and fall occurred on a public sidewalk, municipal road, or other government-maintained property, there are additional procedural requirements. Under the Municipal Act, you are generally required to provide written notice of your claim to the municipality within 10 days of the accident. Failing to do this can permanently bar your claim against the municipality.\n\nImportant: The 10-day municipal notice requirement is one of the shortest deadlines in Ontario's personal injury system. If your fall occurred on a public sidewalk, road, or municipal property, do not wait.",
      },
      {
        heading: 'Documenting Your Slip and Fall',
        type: 'list',
        body: "Photographs of the hazard taken at the scene, as soon as possible after the accident\nWitness contact information from anyone who saw the fall or the hazard\nIncident reports filed with the property owner, manager, or store\nMedical records documenting your injuries from as early as possible\nRecords of weather conditions (for outdoor falls involving ice or snow)",
      },
    ],
  },
  // ─── NEW ARTICLES ───────────────────────────────────────────────────
  {
    slug: 'what-to-do-after-car-accident-ontario',
    title: 'What to Do Immediately After a Car Accident in Ontario',
    description: 'The steps you take in the first hours after an Ontario car accident can directly affect your ability to claim benefits. Here is what to do — and what to avoid.',
    category: 'Motor Vehicle',
    readTime: '6 min read',
    oldHtmlPath: '/blog-after-accident.html',
    sections: [
      { type: 'paragraph', body: "The first thing most people feel after a car accident is shock. The second thing is confusion about what to do next. What you do — or don't do — in the hours immediately following an accident can have a real impact on your ability to claim benefits and protect your legal rights." },
      { heading: '1. Make Sure Everyone Is Safe', type: 'paragraph', body: "Check for injuries. If anyone is hurt, call 911 immediately. In Ontario, you are legally required to call police if the accident involves injuries, death, or property damage over $2,000. Do not move injured people unless there is immediate danger." },
      { heading: '2. Call Police If Required', type: 'callout', body: "Ontario law (Highway Traffic Act) requires you to call police if the accident involves:\n\nInjuries or death\nProperty damage over $2,000\nA hit and run\nA vehicle that is not driveable\n\nIf the accident involves only minor damage and no injuries, you may be directed to a Collision Reporting Centre instead of having officers attend the scene." },
      { heading: '3. Notify Your Own Insurer — Within 7 Days', type: 'callout', body: "This is one of the most missed deadlines in Ontario. You are required to notify your own automobile insurer that an accident occurred as soon as practicable, and in any event within 7 days.\n\nThis notification is not the same as filing a full claim. It is simply putting your insurer on notice. Failing to provide timely notice can give your insurer grounds to reduce or deny your accident benefits claim." },
      { heading: '4. Document the Scene', type: 'list', body: "Photograph the damage to all vehicles involved\nPhotograph the road, intersection, traffic signs, and weather conditions\nRecord the other driver's name, licence plate, insurance company, and policy number\nGet contact information from any witnesses\nNote the time, date, and exact location of the accident" },
      { heading: '5. Seek Medical Attention', type: 'paragraph', body: "Even if you do not feel seriously hurt, see a doctor as soon as possible. Many injuries — particularly soft tissue injuries, concussions, and psychological trauma — do not present immediately. A medical record created close to the time of the accident creates a documented link between the accident and your injuries. Waiting weeks or months to seek treatment weakens your claim significantly." },
      { heading: '6. Do Not Admit Fault or Apologize', type: 'callout', body: "Do not apologize at the scene, even out of politeness. In Ontario, statements made at the scene can be used against you in insurance proceedings. Fault is determined by your insurer and the Fault Determination Rules — not by what was said roadside." },
      { heading: '7. Keep Records of Everything', type: 'list', body: "All medical appointments, diagnoses, and treatments related to the accident\nTime missed from work and your income at the time of the accident\nAny expenses related to your injuries — prescriptions, travel to appointments, home help\nAll correspondence with your insurer" },
      { type: 'paragraph', body: "The days immediately after an accident are when the foundation of your claim is built. A free review can help you understand what your next steps should be based on what has already happened." },
    ],
  },
  {
    slug: 'car-accident-not-my-fault-ontario',
    title: 'Car Accident That Was Not Your Fault in Ontario: What You Are Entitled To',
    description: "If you were not at fault in an Ontario car accident, you may be entitled to accident benefits through your own insurer and damages through a tort claim. Here's what that means in practice.",
    category: 'Motor Vehicle',
    readTime: '6 min read',
    oldHtmlPath: '/blog-not-my-fault.html',
    sections: [
      { type: 'paragraph', body: "Being in a car accident that wasn't your fault is disorienting. You did nothing wrong, but now you're dealing with injuries, a damaged vehicle, missed work, and an insurance system that can feel indifferent to who caused the problem. In Ontario, not being at fault does matter — but probably not in the ways you expect." },
      { heading: 'Your Own Insurer Pays Your Accident Benefits — Regardless of Fault', type: 'callout', body: "Ontario operates under a no-fault accident benefits system. This means that even though the other driver caused the accident, you access your income replacement, medical, and rehabilitation benefits through your own automobile insurer — not through the at-fault driver's insurer.\n\nThis often surprises people. The at-fault driver's insurer is involved in a tort (lawsuit) claim, not in your accident benefits claim." },
      { heading: 'What You May Be Entitled To as a Not-At-Fault Victim', type: 'list', body: "Accident benefits (income replacement, medical, rehabilitation, attendant care) through your own insurer\nA tort claim against the at-fault driver for pain and suffering, future income loss, and future care costs beyond SABS limits\nProperty damage compensation from the at-fault driver's insurer (Direct Compensation Property Damage — DCPD)\nPossible access to Family Law Act claims if serious injuries affect your family" },
      { heading: 'The Tort Claim: Suing the At-Fault Driver', type: 'paragraph', body: "Because you were not at fault, you have the right to bring a tort claim against the at-fault driver. This is separate from your accident benefits claim. A tort claim can compensate you for pain and suffering, loss of enjoyment of life, future income loss, and future care costs that exceed your SABS coverage.\n\nHowever, there is a threshold: Ontario requires that your injuries constitute a \"serious and permanent\" impairment of an important physical, mental, or psychological function before you can claim general damages (non-economic losses like pain and suffering). Minor soft-tissue injuries often don't meet this threshold." },
      { heading: 'The 2-Year Limitation Period for Tort Claims', type: 'callout', body: "If you intend to sue the at-fault driver, you must file a claim within 2 years of the date of the accident. Missing this deadline permanently eliminates your right to sue. Do not assume your accident benefits claim and your tort claim are the same thing — they are separate proceedings with separate timelines." },
      { heading: 'What at-fault Determination Means for Your Future Premiums', type: 'paragraph', body: "If the accident is determined to be 0% your fault, your own insurer is required under Ontario regulations to protect your driving record from being impacted by the at-fault driver's accident. Your premiums cannot be raised solely because you were involved in a not-at-fault accident." },
      { type: 'paragraph', body: "Understanding exactly what you're entitled to as a not-at-fault victim — and ensuring you've claimed all of it — is what a free review is designed to help with." },
    ],
  },
  {
    slug: 'accident-claim-denied-ontario',
    title: 'Your Ontario Accident Claim Was Denied. Here Is What to Do Next.',
    description: 'A denial from your insurer is not the end. Ontario has a formal dispute process — but there are strict deadlines. Here is exactly what to do after a denial.',
    category: 'Insurer Disputes',
    readTime: '5 min read',
    oldHtmlPath: '/blog-denied.html',
    sections: [
      { type: 'paragraph', body: "You filed your accident benefits claim. You did what you were supposed to do. And then your insurer sent a letter telling you the claim is denied. It is a stressful, frustrating moment — and one that many people accept as final when it isn't." },
      { heading: 'A Denial Is Not the Final Word', type: 'callout', body: "Ontario law provides a formal dispute resolution process for accident benefit denials, administered by the Financial Services Regulatory Authority of Ontario (FSRA). You have the right to challenge your insurer's decision — but you must act before the deadline expires." },
      { heading: 'Step 1: Note the Date of the Denial Letter', type: 'paragraph', body: "Your right to apply for dispute resolution through FSRA expires 2 years from the date your insurer refused, suspended, or terminated the benefit. The clock starts from the denial letter, not from when you decide to do something about it. Write the date down now." },
      { heading: 'Step 2: Understand Why You Were Denied', type: 'list', body: "Read the denial letter carefully. The most common reasons include:\nYour injury was classified as a minor injury under the Minor Injury Guideline (MIG)\nThe insurer argues the treatment is not reasonable and necessary\nAn independent medical examination (IME) concluded your injuries are less severe than claimed\nYou missed a procedural deadline (late notice, incomplete forms)\nThe insurer disputes whether your condition pre-dates the accident" },
      { heading: 'Step 3: Request an Internal Review (Optional)', type: 'paragraph', body: "Within 10 business days of a denial, you can request an internal review from your insurer. This is an informal process where the insurer reconsiders the decision. It can sometimes resolve clear-cut errors without formal proceedings. However, an internal review does not pause your 2-year FSRA deadline — the clock keeps running regardless." },
      { heading: 'Step 4: Apply to FSRA for Dispute Resolution', type: 'callout', body: "If the denial stands, you can apply to FSRA for formal dispute resolution. The two main processes are:\n\nMediation: A neutral mediator helps both sides reach an agreement. Non-binding — either party can reject the outcome.\nArbitration: A binding decision by an arbitrator. The arbitrator can award the disputed benefit plus interest and costs.\n\nYou must apply within 2 years of the denial. Missing this deadline permanently eliminates your right to challenge." },
      { type: 'paragraph', body: "If your claim has been denied or your benefits have been reduced, a free review can help you understand what your options are and whether the denial is likely worth challenging." },
    ],
  },
  {
    slug: 'whiplash-claim-ontario',
    title: 'Whiplash Claims in Ontario: The Minor Injury Guideline and Your Rights',
    description: 'Whiplash is the most common injury from Ontario car accidents — and the one most frequently capped under the Minor Injury Guideline. Here is what that means for your claim.',
    category: 'Medical Benefits',
    readTime: '6 min read',
    oldHtmlPath: '/blog-whiplash.html',
    sections: [
      { type: 'paragraph', body: "Whiplash — or whiplash-associated disorder (WAD) — is the single most common injury in Ontario car accidents. It is also the injury most frequently placed under the Minor Injury Guideline (MIG), which limits your accident benefits treatment to a maximum of $3,500. For many people with genuine ongoing pain and limitations, $3,500 is not enough." },
      { heading: 'What Is the Minor Injury Guideline (MIG)?', type: 'callout', body: "The Minor Injury Guideline is an Ontario regulation that applies to certain soft-tissue injuries: sprains, strains, contusions, abrasions, lacerations, and whiplash-associated disorders (WAD Grade I and II).\n\nUnder the MIG, total treatment costs are capped at $3,500 — regardless of how much treatment you actually need or how long recovery takes. Insurers routinely apply MIG treatment caps to limit exposure on soft-tissue claims." },
      { heading: 'When You Can Argue You Fall Outside the MIG', type: 'paragraph', body: "Not every whiplash case stays in the MIG. You may be able to argue that your injuries fall outside the guideline if: You have a documented pre-existing condition that was worsened by the accident. Your injuries have progressed to WAD Grade III (neurological involvement). You have developed chronic pain, psychological injury (anxiety, depression, PTSD), or cognitive impairment as a result of the accident." },
      { heading: 'What Evidence Supports a MIG Challenge', type: 'list', body: "Medical records showing a pre-existing condition that was aggravated\nDiagnoses of psychological injury from a treating clinician\nEvidence of chronic pain syndrome from a specialist\nNeurological findings supporting WAD Grade III\nTreatment records showing the $3,500 cap was reached and symptoms persist" },
      { heading: 'The MIG Challenge Process', type: 'paragraph', body: "To dispute a MIG classification, you typically need a medical professional to prepare a report supporting removal from the MIG. Your insurer may then arrange an independent medical examination (IME) to challenge that position. If the dispute is not resolved, it can proceed to formal dispute resolution through FSRA." },
      { heading: 'Psychological Injuries After an Accident', type: 'callout', body: "Ontario courts and arbitrators have increasingly recognized psychological injuries (anxiety, depression, PTSD) resulting from car accidents as standing outside the MIG. If you are experiencing significant mental health impacts following your accident, this is worth exploring — even if your physical injuries were initially classified as minor." },
      { type: 'paragraph', body: "If you were placed in the MIG and your symptoms have persisted beyond what $3,500 of treatment has addressed, a free review can help clarify whether your situation may warrant a challenge." },
    ],
  },
  {
    slug: 'pain-and-suffering-settlement-ontario',
    title: 'Pain and Suffering Settlements in Ontario: What They Are and What Affects the Amount',
    description: 'Pain and suffering damages in Ontario are part of a tort claim — separate from accident benefits. Understanding what affects the value of your claim matters before you accept any offer.',
    category: 'Settlements',
    readTime: '7 min read',
    oldHtmlPath: '/blog-pain-suffering.html',
    sections: [
      { type: 'paragraph', body: "\"Pain and suffering\" is one of the most searched terms by Ontario accident victims — and one of the most misunderstood. It is not a benefit paid by your own insurer under SABS. It is a type of damages claimed through a lawsuit against the at-fault driver. The distinction matters because the two types of compensation work completely differently." },
      { heading: 'Pain and Suffering Is a Tort Claim — Not a SABS Benefit', type: 'callout', body: "Your accident benefits (income replacement, medical, rehabilitation) come from your own insurer under SABS. Pain and suffering damages — also called non-economic damages or general damages — are claimed through a tort lawsuit against the at-fault driver's insurer.\n\nYou can pursue both at the same time. They are separate claims with separate processes." },
      { heading: 'The Threshold Requirement in Ontario', type: 'paragraph', body: "Ontario has a tort threshold that limits who can claim non-economic damages. To be eligible, your injuries must constitute a serious and permanent impairment of an important physical, mental, or psychological function. This is a meaningful barrier. Minor soft-tissue injuries (whiplash, sprains) generally do not meet the threshold — which is one reason the MIG and the tort threshold work together to limit smaller claims." },
      { heading: 'What Factors Affect the Value of a Pain and Suffering Claim', type: 'list', body: "Severity and permanence of the injury\nImpact on daily activities, relationships, and quality of life\nAge of the claimant (younger victims with permanent impairments receive higher awards)\nPre-accident health and lifestyle\nMedical evidence — the strength and consistency of treating physician reports\nHow well-documented the impact on life has been (journals, testimony from family)\nComparable Ontario case decisions" },
      { heading: 'The Statutory Deductible', type: 'callout', body: "Ontario applies a statutory deductible to pain and suffering awards under $100,000. As of recent adjustments, the deductible is approximately $46,000 — meaning if a jury awards you $60,000 in general damages, the deductible reduces your actual payment to approximately $14,000.\n\nThis deductible does not apply to awards over $100,000. It is one of the most significant and least-understood features of Ontario tort law that affects real settlement values." },
      { heading: 'Why Initial Settlement Offers Are Almost Always Low', type: 'paragraph', body: "Insurers make initial offers knowing most claimants don't understand the full value of their claim. Common tactics include making an early offer before the full extent of injuries is known, bundling accident benefits and tort into a single release, and relying on claimants' desire for closure over maximum recovery." },
      { type: 'paragraph', body: "Before accepting any settlement that includes pain and suffering, understanding the real value of your claim matters. A free review is a no-pressure first step." },
    ],
  },
  {
    slug: 'how-long-accident-benefits-claim-ontario',
    title: 'How Long Does an Ontario Accident Benefits Claim Take?',
    description: 'Timeline expectations for Ontario accident benefits claims vary widely depending on injury severity, insurer responsiveness, and whether disputes arise. Here is a realistic picture.',
    category: 'Deadlines & Timelines',
    readTime: '5 min read',
    oldHtmlPath: '/blog-timeline.html',
    sections: [
      { type: 'paragraph', body: "One of the most common questions after an Ontario accident is: how long will this take? The honest answer is that it depends heavily on the nature of your injuries, whether your insurer disputes anything, and how quickly you move through the initial application process." },
      { heading: 'The Initial Application Phase: 0–60 Days', type: 'callout', body: "Within 7 days: Notify your insurer the accident occurred.\nWithin 10 business days: Your insurer must send you the application forms (OCF forms).\nWithin 30 days of receiving forms: Return completed application.\nWithin 10 business days of receiving your application: Insurer must respond with a determination on accident benefits.\n\nIn practice, initial benefit decisions often take 3–6 weeks after your forms are received." },
      { heading: 'Minor Injury Claims: 3–6 Months', type: 'paragraph', body: "For injuries classified under the Minor Injury Guideline (MIG), the claim is typically short. The $3,500 treatment limit is often reached within a few months of treatment. If there are no disputes, the claim closes when treatment ends or the cap is reached." },
      { heading: 'Non-Catastrophic Injury Claims: 6 Months to 2+ Years', type: 'paragraph', body: "For more serious injuries, the claims process is longer. Treatment, ongoing assessments, and potential disputes about benefit levels can extend a non-catastrophic claim considerably. Income replacement benefits continue while you are off work, which can extend the claim timeline significantly." },
      { heading: 'Disputed Claims: Add 1–3 Years', type: 'callout', body: "If your insurer denies a benefit or disputes your injury classification, formal dispute resolution through FSRA adds significant time:\n\nInternal review: 1–4 weeks\nFSRA mediation: typically scheduled within 3–6 months of application\nArbitration (if mediation fails): can add another 6–18 months\n\nDisputed catastrophic impairment cases can take 3–5 years to fully resolve." },
      { heading: 'The 104-Week Transition: A Critical Milestone', type: 'paragraph', body: "At the 2-year mark, your eligibility test for income replacement benefits changes. This is a critical point in the timeline where many claimants see their IRB reduced or eliminated without having been prepared for it. If your claim is approaching the 104-week mark, that should prompt a review of your situation." },
      { type: 'paragraph', body: "Knowing where your claim stands in the timeline — and what milestones are coming — is exactly what a free review is designed to help with." },
    ],
  },
  {
    slug: 'insurance-dispute-fsra-mediation-ontario',
    title: 'How FSRA Mediation Works for Ontario Accident Benefit Disputes',
    description: 'When your insurer denies a benefit and an internal review fails, FSRA mediation is the next step. Here is what to expect from the process.',
    category: 'Insurer Disputes',
    readTime: '6 min read',
    oldHtmlPath: '/blog-fsra.html',
    sections: [
      { type: 'paragraph', body: "If your Ontario accident benefits claim has been denied and you've exhausted direct discussions with your insurer, the Financial Services Regulatory Authority of Ontario (FSRA) provides a formal dispute resolution process. For most people, mediation is the first formal step." },
      { heading: 'What Is FSRA Mediation?', type: 'callout', body: "FSRA mediation is a structured, confidential negotiation facilitated by a neutral mediator appointed by FSRA. The mediator does not decide the outcome — they help both sides reach a voluntary agreement. If no agreement is reached, the case can proceed to arbitration.\n\nKey point: Mediation is non-binding. Either party can reject the outcome and proceed to arbitration." },
      { heading: 'Who Can Apply', type: 'paragraph', body: "Any accident benefits claimant whose insurer has denied, reduced, or terminated a benefit can apply for FSRA dispute resolution. You must apply within 2 years of the insurer's refusal. Applications are submitted through FSRA's online portal." },
      { heading: 'What to Expect at Mediation', type: 'list', body: "Both parties submit statements of claim and response before the session\nThe session is typically conducted by video or phone (in-person is rare)\nThe mediator meets with both sides — sometimes separately\nA mediation session typically runs 2–4 hours\nIf an agreement is reached, it is documented and binding\nIf no agreement is reached, FSRA issues a certificate allowing you to proceed to arbitration" },
      { heading: 'What Disputes Can Be Mediated', type: 'list', body: "Denial of income replacement or non-earner benefits\nDisputes about medical and rehabilitation benefit amounts\nMIG classification disputes\nDenials based on independent medical examinations\nCatastrophic impairment designation disputes\nAttendant care disputes" },
      { heading: 'Preparation Matters', type: 'paragraph', body: "The claimants who do best in mediation are those who have organized medical evidence, understand the basis for the insurer's denial, and have a clear picture of what benefits they are entitled to. Going in without preparation puts you at a significant disadvantage when the insurer has experienced adjusters on their side." },
      { type: 'paragraph', body: "If you are heading toward a dispute — or already in one — a free review can help you understand what benefits are at stake and what position your situation may support." },
    ],
  },
  {
    slug: 'pedestrian-accident-ontario-rights',
    title: 'Hit by a Car in Ontario: Accident Benefits and Your Rights as a Pedestrian',
    description: 'Pedestrians hit by a vehicle in Ontario have strong rights under SABS — but many do not realize they can claim accident benefits even if they do not own a car.',
    category: 'Motor Vehicle',
    readTime: '5 min read',
    oldHtmlPath: '/blog-pedestrian.html',
    sections: [
      { type: 'paragraph', body: "Being struck by a vehicle as a pedestrian in Ontario is one of the most traumatic accident scenarios — and one where victims often underestimate their legal rights. A common misconception is that accident benefits are only available to drivers. They are not." },
      { heading: 'Pedestrians Can Claim Accident Benefits', type: 'callout', body: "In Ontario, accident benefits are available to pedestrians, cyclists, and passengers — not just drivers. If you were struck by a vehicle, you are entitled to claim accident benefits. The question is: which insurer pays?\n\nIf you have your own automobile insurance policy, your own insurer pays first. If you do not have automobile insurance, the insurer of the vehicle that struck you is responsible. If that vehicle was uninsured or the driver fled (hit and run), OPCF-44R (uninsured automobile coverage) through the Motor Vehicle Accident Claims Fund may apply." },
      { heading: 'What a Pedestrian Victim May Claim', type: 'list', body: "Income replacement benefits if unable to work\nMedical and rehabilitation benefits for treatment\nAttendant care if injuries require daily assistance\nNon-earner benefits if not employed at the time\nDeath and funeral benefits if the accident was fatal (for surviving family members)" },
      { heading: 'The Tort Claim Against the Driver', type: 'paragraph', body: "As a pedestrian who was not at fault, you also have the right to bring a tort claim against the driver who hit you for pain and suffering, future income loss, and future care beyond SABS limits. The 2-year limitation period applies. Pedestrian tort claims are often higher in value than vehicle-on-vehicle claims because pedestrians are typically more severely injured." },
      { heading: 'The 10-Day Municipal Notice — If It Happened on a City Street', type: 'callout', body: "If the accident involved a condition of the road, sidewalk, or intersection that a municipality was responsible for maintaining — poor signage, road defects, inadequate lighting — you may have a separate claim against the municipality. Municipal claims require written notice within 10 days under the Municipal Act. This is one of the shortest deadlines in Ontario personal injury law." },
      { type: 'paragraph', body: "Pedestrian accident claims involve multiple potential benefit sources and a tort claim. A free review can help clarify which apply to your situation and what steps to take next." },
    ],
  },
  {
    slug: 'psychological-injury-accident-ontario',
    title: 'Psychological Injuries After an Ontario Accident: What You Are Entitled To',
    description: 'Anxiety, depression, and PTSD following an Ontario accident are recognized injuries under SABS. Many claimants with psychological impacts do not realize they can claim beyond the MIG.',
    category: 'Medical Benefits',
    readTime: '5 min read',
    oldHtmlPath: '/blog-psych.html',
    sections: [
      { type: 'paragraph', body: "After an accident, physical injuries are usually the first concern. But for many Ontario accident victims, the psychological impact — anxiety, depression, post-traumatic stress, fear of driving, disrupted sleep — is as debilitating as any physical injury. Ontario's accident benefits system recognizes psychological injuries, but many claimants never pursue them." },
      { heading: 'Psychological Injuries Can Fall Outside the MIG', type: 'callout', body: "The Minor Injury Guideline (MIG) applies to specific physical soft-tissue injuries. It does not apply to psychological injuries. If you have developed a diagnosed psychological condition as a result of the accident — such as PTSD, major depressive disorder, or anxiety disorder — your claim may be entitled to fall outside the MIG's $3,500 treatment cap.\n\nThis is significant: if the only reason you're in the MIG is a physical soft-tissue injury, but you also have a psychological injury, you may be able to argue removal from the MIG on those grounds." },
      { heading: 'What Counts as a Psychological Injury', type: 'list', body: "Post-traumatic stress disorder (PTSD)\nMajor depressive disorder\nGeneralized anxiety disorder\nAdjustment disorder\nPanic disorder\nChronic pain with psychological overlay" },
      { heading: 'What Evidence You Need', type: 'list', body: "A diagnosis from a treating psychologist, psychiatrist, or family physician\nTreatment records showing the psychological condition and its link to the accident\nFunctional capacity evidence showing how the condition limits daily activities" },
      { heading: 'Treatment Benefits for Psychological Injuries', type: 'paragraph', body: "Under SABS, medical and rehabilitation benefits cover psychological treatment — including psychotherapy, counselling, and psychiatric assessment. If your injury falls outside the MIG, the standard non-catastrophic treatment limit applies, which is substantially higher than the MIG cap." },
      { heading: 'Psychological Injuries and the Tort Threshold', type: 'paragraph', body: "Serious psychological injuries — particularly PTSD that causes permanent functional impairment — can also meet Ontario's tort threshold, allowing a claim for pain and suffering against the at-fault driver. Courts have increasingly recognized psychological impairment as meeting the 'serious and permanent' standard." },
      { type: 'paragraph', body: "If you are dealing with psychological impacts from an accident and your claim has been limited to MIG coverage, a free review can help assess whether your situation may warrant a different treatment." },
    ],
  },
  {
    slug: 'ontario-accident-benefits-application-guide',
    title: 'The Ontario Accident Benefits Application: A Step-by-Step Plain-Language Guide',
    description: 'The OCF forms required to apply for Ontario accident benefits are confusing and critical. Missing a step or a deadline can cost you. Here is what you need to know.',
    category: 'Insurance Rights',
    readTime: '7 min read',
    oldHtmlPath: '/blog-application.html',
    sections: [
      { type: 'paragraph', body: "One of the first concrete tasks after an Ontario accident is completing the accident benefits application forms — a package of forms known as OCF forms (Ontario Claims Forms). These forms are how you formally start your accident benefits claim with your insurer. Getting them right matters." },
      { heading: 'The 30-Day Deadline Is Real', type: 'callout', body: "After you notify your insurer of the accident, they must send you the OCF forms within 10 business days. You then have 30 days from receiving the forms to return them completed. Missing this deadline gives your insurer grounds to deny your claim. Do not set the forms aside." },
      { heading: 'The Core OCF Forms', type: 'list', body: "OCF-1 (Application for Accident Benefits): The primary application. Covers your personal information, description of the accident, and types of benefits you are applying for.\nOCF-2 (Employer's Confirmation Form): Required for income replacement benefits. Your employer confirms your pre-accident income and employment status.\nOCF-3 (Disability Certificate): Completed by your treating physician or health practitioner. Certifies the nature of your injuries and your functional limitations.\nOCF-10 (Election of Income Replacement, Non-Earner, or Caregiver Benefit): You must choose which primary weekly benefit applies to your situation." },
      { heading: 'Common Mistakes on OCF Forms', type: 'list', body: "Understating the impact of your injuries — describe your limitations fully, not just your diagnoses\nLeaving sections blank because you're unsure — write your best information and note uncertainty\nMissing the OCF-3 because you haven't seen a doctor yet — seek medical attention promptly and have the form completed\nNot completing the OCF-10 election — failing to elect can delay or forfeit benefits\nNot keeping a copy of everything you submit" },
      { heading: 'What Happens After You Submit', type: 'paragraph', body: "Within 10 business days of receiving your completed application, your insurer must provide a written decision on each benefit. In practice, this often takes longer. The insurer may request additional medical information before deciding, which can extend the timeline." },
      { heading: 'Keep Records of Everything', type: 'callout', body: "Keep a dated copy of every form you submit. Send forms by a method that generates proof of receipt — registered mail or email with confirmation. If your insurer claims they never received your forms, you need proof of submission to protect yourself." },
      { type: 'paragraph', body: "The application process sets the foundation for your entire accident benefits claim. A free review can help you understand whether your application covered everything you're entitled to — and what to do if something was missed." },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
