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
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
