#!/usr/bin/env node
/** Generate data/charter.json — full 114 articles + preamble */
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const corePath = join(root, 'public/sc-core.js');

// Preserve existing 14 articles verbatim from sc-core.js
const core = readFileSync(corePath, 'utf8');
const start = core.indexOf('window.CHARTER = [');
let i = core.indexOf('[', start);
let depth = 0;
for (; i < core.length; i++) {
  if (core[i] === '[') depth++;
  else if (core[i] === ']') { depth--; if (depth === 0) { i++; break; } }
}
const existing = eval(core.slice(core.indexOf('[', start), i));

const preserved = new Map();
existing.forEach((ch) => ch.articles.forEach((a) => preserved.set(a.num, { ...a, chapter: ch.chapter })));

function art(num, title, subtitle, body, opts = {}) {
  if (preserved.has(num)) {
    const p = preserved.get(num);
    return { num, title: p.title, subtitle: p.subtitle || subtitle, body: p.body, sherpa: p.sherpa, sherpa_ext: p.sherpa_ext ?? null, tags: p.tags };
  }
  return {
    num,
    title,
    subtitle,
    body,
    sherpa: opts.sherpa ?? false,
    sherpa_ext: opts.sherpa_ext ?? null,
    tags: opts.tags || [],
  };
}

const defs = [
  { chapter: 'Preamble', nums: ['P.1'], articles: [
    art('P.1', 'On the Foundation of Rights', 'Basis of all SherpaCarta Articles', ''),
  ]},
  { chapter: 'Chapter I — Foundational Rights', range: [1, 10], articles: [
    art('Art. 1', 'Human Dignity in Digital Spaces', 'The Inviolability of the Person Online', ''),
    art('Art. 2', 'Equality Before Digital Law', 'Universal Application Without Exception', ''),
    art('Art. 3', 'Right to Digital Existence', 'No Person May Be Digitally Erased Against Their Will', ''),
    art('Art. 4', 'Freedom from Digital Servitude', 'No Coerced Labor Through Platforms', 'No person shall be compelled to perform unpaid digital labor—content moderation, data labeling, training data contribution, or attention harvesting—as a condition of accessing essential digital services.<br><br>Terms of service that require users to surrender intellectual property, perpetual license to personal content, or mandatory participation in surveillance economies as price of admission are void ab initio.'),
    art('Art. 5', 'Right to Informed Digital Citizenship', 'Understanding the Systems That Govern You', 'Every person has the right to understand, in plain language, how digital systems affecting their rights operate—including algorithms that rank, recommend, moderate, price, or exclude them.<br><br>States and corporations must publish citizen-readable explanations of digital governance systems. Technical complexity is not a shield against accountability.'),
    art('Art. 6', 'Protection of Minors in Digital Spaces', 'Childhood Cannot Be Monetized', 'Children and adolescents possess enhanced digital rights protections. Profiling, behavioral advertising, and data collection targeting minors is prohibited without explicit parental consent and independent child-welfare review.<br><br>Design features that exploit developmental vulnerability—infinite scroll, variable reward mechanics, social comparison pressure—shall not be deployed in services primarily used by minors.'),
    art('Art. 7', 'Right to Digital Sanctuary', 'Spaces Free from Commercial Surveillance', 'Every person has the right to digital spaces free from commercial surveillance, behavioral tracking, and attention extraction—whether in education, healthcare, worship, grief, or intimate communication.<br><br>Sanctuary spaces must be technically enforced, not merely promised in privacy policies.'),
    art('Art. 8', 'Prohibition of Digital Caste Systems', 'No Permanent Digital Underclass', 'No system shall permanently classify persons into tiers of digital access, creditworthiness, social visibility, or civic participation based on past behavior, associations, or algorithmic scores without recourse.<br><br>Digital caste—permanent exclusion from employment, housing, finance, or civic life through unappealable digital markers—is prohibited.'),
    art('Art. 9', 'Right to Technological Literacy', 'Education as Prerequisite for Sovereignty', 'States have a positive obligation to ensure all persons can understand, configure, and defend their digital rights. Digital literacy is a component of basic education equivalent to reading and numeracy.<br><br>No person shall be deemed to have waived rights through ignorance of technology.'),
    art('Art. 10', 'Binding of Private Power', 'Corporations Are Bound Equally With States', 'Any entity whose digital systems affect more than one million persons—whether state, corporation, or platform—is bound by SherpaCarta with equal force.<br><br>Market capitalization, user count, or technical sophistication does not confer immunity from human rights obligations.'),
  ]},
  { chapter: 'Chapter II — Privacy & Data Sovereignty', range: [11, 20], articles: [
    art('Art. 11', 'Right to Privacy', 'The Cornerstone Article — Absolute Protection from Surveillance', ''),
    art('Art. 12', 'Data Sovereignty', 'You Own Your Data — Without Exception', ''),
    art('Art. 13', 'Prohibition of Surveillance Capitalism', 'Your Attention and Behavior May Not Be Sold Without Consent', ''),
    art('Art. 14', 'Right to Communications Secrecy', 'Private Messages Stay Private', 'The content and metadata of private communications shall not be accessed, stored, analyzed, or disclosed without specific judicial authorization naming the individual and the crime under investigation.<br><br>End-to-end encryption is a human right. No state or corporation may mandate backdoors in secure communications systems available to the general public.'),
    art('Art. 15', 'Biometric Data Protection', 'Your Body Is Not a Password for Corporations', 'Biometric identifiers—face, voice, gait, retina, DNA-derived markers—may not be collected without informed consent, may not be sold, and must be deletable on demand.<br><br>Biometric surveillance in public spaces requires democratic authorization through referendum or supermajority legislative vote, renewed every two years.'),
    art('Art. 16', 'Location Privacy', 'Where You Go Is Your Business', 'Continuous location tracking of persons not individually suspected of specific crimes is prohibited. Location data belongs to the person who generates it.<br><br>Aggregated mobility data may not be sold to third parties. Historical location data must be deletable within 30 days of request.'),
    art('Art. 17', 'Prohibition of Shadow Profiles', 'You Cannot Be Profiled Without Knowledge', 'Creating profiles of persons who are not users of a service—through data broker aggregation, social graph inference, or cross-platform tracking—is prohibited.<br><br>Every person has the right to know if a profile exists about them and to demand its deletion.'),
    art('Art. 18', 'Health Data Sovereignty', 'Medical Data Is Sacred', 'Health, genetic, and disability data receive the highest protection tier. No commercial use without explicit opt-in renewed annually. No sharing with insurers, employers, or governments without judicial order.<br><br>Health apps and wearables must operate in local-first mode by default, with cloud sync as opt-in only.'),
    art('Art. 19', 'Financial Data Privacy', 'Your Money Trail Is Private', 'Transaction data, credit behavior, and financial metadata belong exclusively to the person who generates them. Open banking APIs must be person-initiated, not institution-initiated.<br><br>Financial surveillance of populations not individually suspected of crimes is prohibited.'),
    art('Art. 20', 'Right to Anonymous Digital Participation', 'Pseudonymity Is Not Suspicion', 'Every person has the right to participate in digital society under pseudonym without forfeiting rights or facing presumption of criminal intent.<br><br>States may not require real-name registration for general internet access, social participation, or political expression.'),
  ]},
  { chapter: 'Chapter III — Expression & Access', range: [21, 30], articles: [
    art('Art. 21', 'Freedom of Digital Expression', 'The Right to Speak Online Without Fear', ''),
    art('Art. 22', 'Universal Internet Access', 'Connectivity as Infrastructure — Like Water and Electricity', ''),
    art('Art. 23', 'Net Neutrality as Human Right', 'All Bits Are Equal', 'Internet service providers and platforms shall not block, throttle, prioritize, or degrade lawful traffic based on source, destination, content, or commercial relationship.<br><br>Zero-rating schemes that create tiered internet access based on corporate partnerships violate this article.'),
    art('Art. 24', 'Right to Platform Due Process', 'Bans Require Justice, Not Moderator Whim', 'Permanent exclusion from platforms exceeding one million users requires: published rules, specific violation citation, meaningful appeal to independent review, and proportionality assessment.<br><br>Shadow-banning, reach suppression without notification, and demonetization without appeal violate due process.'),
    art('Art. 25', 'Protection of Whistleblowers', 'Truth Needs Courage and Shield', 'Persons who disclose evidence of digital rights violations, mass surveillance, or corporate malfeasance receive SherpaCarta safe harbor protection from retaliation.<br><br>Encryption tools for whistleblower communication shall not be criminalized.'),
    art('Art. 26', 'Right to Receive Information', 'The Right to Read Is the Right to Know', 'No state or platform may block access to lawful information based on political viewpoint. Filtering must be user-controlled, transparent, and off by default.<br><br>Internet shutdowns and DNS blocking of news sources are prohibited under all circumstances except named judicial orders against specific illegal content.'),
    art('Art. 27', 'Journalist and Researcher Protections', 'Investigation Requires Independence', 'Journalists, researchers, and civil society investigators have enhanced protections for data access, source confidentiality, and freedom from platform retaliation when reporting in the public interest.<br><br>Scraping publicly available data for accountability research is a protected activity.'),
    art('Art. 28', 'Cultural and Linguistic Expression', 'No Language Is a Second Class Online', 'Digital platforms must support equitable access for all languages and writing systems. Automated translation must not replace human cultural expression rights.<br><br>Minority language communities have the right to digital presence without algorithmic demotion.'),
    art('Art. 29', 'Right to Satire and Parody', 'Mockery of Power Is Protected Speech', 'Satire, parody, and political caricature directed at states, corporations, and public figures are protected expression. Automated content moderation must not remove satire without human review.<br><br>SLAPP suits and strategic litigation against digital critics are discouraged and subject to accelerated dismissal.'),
    art('Art. 30', 'Academic and Scientific Freedom Online', 'Knowledge Cannot Be Paywalled by Censorship', 'Academic research, scientific preprints, and educational materials may not be suppressed by corporate or state pressure. Open access to publicly funded research is mandatory.<br><br>Researchers have the right to publish findings about algorithmic harm without prior platform approval.'),
  ]},
  { chapter: 'Chapter IV — Identity & Consent', range: [31, 40], articles: [
    art('Art. 31', 'Self-Sovereign Identity', 'You Control Who You Are Online', 'Every person has the right to create, control, and revoke digital identities without dependency on any single corporation or state registry.<br><br>Decentralized identity standards must be supported by public services. No monopoly identity provider shall be mandated.'),
    art('Art. 32', 'Meaningful Consent', 'Silence Is Not Agreement', 'Consent to data processing must be granular, revocable, and obtained through affirmative action—not pre-checked boxes, dark patterns, or continued use after buried policy changes.<br><br>Bundled consent covering unrelated purposes is void.'),
    art('Art. 33', 'Right to Disconnect', 'You May Log Off Without Penalty', 'No employer, platform, or service may penalize persons for declining always-on connectivity, after-hours messaging, or perpetual availability.<br><br>Right to disconnect is enforceable against gig economy platforms and remote work surveillance.'),
    art('Art. 34', 'Prohibition of Coerced Biometric Enrollment', 'Your Face Is Not a Ticket', 'Biometric identification may not be required for access to housing, employment, education, healthcare, or public transportation.<br><br>Alternative non-biometric access methods must always be available at equal convenience.'),
    art('Art. 35', 'Digital Will and Succession', 'Your Digital Life Outlives You With Dignity', 'Every person may designate digital heirs, deletion instructions, and memorial preferences. Platforms must honor digital wills within 30 days.<br><br>Commercial use of deceased persons\' data without heir consent is prohibited.'),
    art('Art. 36', 'Right to Gender Identity Online', 'Self-Identification Is Sovereign', 'Persons have the right to define and change their gender identity in digital systems without medical gatekeeping, platform verification hurdles, or algorithmic misgendering.<br><br>Deadnaming and forced outing through platform design violate this article.'),
    art('Art. 37', 'Neurodiversity and Accessibility by Design', 'Different Minds, Equal Rights', 'Digital systems must accommodate cognitive, sensory, and neurological differences as default—not as afterthought accessibility patches.<br><br>Autoplay, infinite scroll, and notification bombardment must be off by default.'),
    art('Art. 38', 'Prohibition of Emotional Manipulation', 'Interfaces Must Not Weaponize Psychology', 'Design patterns that exploit fear, urgency, guilt, or social pressure to extract consent, purchases, or engagement are prohibited.<br><br>A/B testing on vulnerable populations without ethics review violates this article.'),
    art('Art. 39', 'Right to Digital Intimacy', 'Private Relationships Are Not Training Data', 'Communications between intimate partners, families, and confidential counselors may not be used for advertising, AI training, or behavioral profiling.<br><br>End-to-end encrypted family and health messaging receives absolute protection.'),
    art('Art. 40', 'Age-Appropriate Design Defaults', 'Safety First for the Young', 'All digital services likely to be accessed by minors must default to highest privacy settings, no profiling, no behavioral advertising, and no contact from unknown adults.<br><br>Age verification systems must not create surveillance databases of minors.'),
  ]},
  { chapter: 'Chapter V — Data Governance & Erasure', range: [41, 50], articles: [
    art('Art. 41', 'Data Minimization Mandate', 'Collect Only What You Need', 'Data collection must be limited to what is strictly necessary for the stated purpose. Purpose creep—using data collected for one reason for another—is prohibited without fresh consent.<br><br>Annual data minimization audits are mandatory for entities processing data on more than 100,000 persons.'),
    art('Art. 42', 'Right to Data Portability', 'Take Your Data and Leave', 'Every person may export all personal data in machine-readable, open-standard formats within 30 days of request, free of charge.<br><br>Portability must include content, metadata, social graphs, and algorithmic inferences made about the person.'),
    art('Art. 43', 'Prohibition of Data Laundering', 'You Cannot Sell What You Stole', 'Data obtained without meaningful consent may not be laundered through mergers, sublicensing, anonymization claims, or synthetic reconstruction.<br><br>Data brokers must maintain chain-of-consent documentation auditable by any data subject.'),
    art('Art. 44', 'Research Data Ethics', 'Science Serves Humanity', 'Research use of personal data requires ethics board approval, informed consent, and right of withdrawal. Public interest research on algorithmic harm receives safe harbor.<br><br>IRB standards apply to corporate AI research on human subjects.'),
    art('Art. 45', 'Right to Human Review', 'No Fully Automated Life Decisions', 'Decisions significantly affecting housing, employment, credit, healthcare, education, liberty, or immigration must include meaningful human review upon request.<br><br>Fully automated rejection without appeal path violates this article.'),
    art('Art. 46', 'Data Protection Impact Assessments', 'Measure Harm Before Deployment', 'High-risk data processing requires public impact assessments before launch, including consultation with affected communities.<br><br>Post-deployment harm discovered triggers mandatory remediation within 90 days.'),
    art('Art. 47', 'Right to Be Forgotten', 'The Right to a Digital Fresh Start', ''),
    art('Art. 48', 'Collective Data Rights', 'Communities Own Community Data', 'Indigenous nations, local communities, and defined groups have collective data sovereignty over information about their members, lands, and cultural practices.<br><br>Extractive data harvesting from marginalized communities without benefit-sharing is prohibited.'),
    art('Art. 49', 'Open Public Data', 'Government Data Belongs to Citizens', 'Non-sensitive government data must be published in open formats by default. Citizens have the right to access data about decisions affecting them.<br><br>Trade secret claims may not shield public safety or rights-violation data.'),
    art('Art. 50', 'Sunset Clauses on Data Retention', 'Data Must Expire', 'Personal data must be deleted when the purpose for collection expires, unless specific legal retention applies. Default maximum retention: two years for behavioral data, five years for transactional records.<br><br>Indefinite retention without justification violates this article.'),
  ]},
  { chapter: 'Chapter VI — Security & Encryption', range: [51, 60], articles: [
    art('Art. 51', 'Right to Strong Encryption', 'Math Is Not a Crime', 'Every person has the right to use strong encryption without restriction. States may not ban, weaken, or mandate backdoors in encryption available to the public.<br><br>Export controls on encryption tools violate this article.'),
    art('Art. 52', 'Security by Default', 'Unsafe Systems Are Defective Products', 'Software and hardware must ship with security enabled by default: automatic updates, secure defaults, minimal attack surface.<br><br>Vendors liable for foreseeable harm from negligent security design.'),
    art('Art. 53', 'Responsible Disclosure Protection', 'Security Researchers Are Allies', 'Good-faith security research and vulnerability disclosure receive safe harbor. Criminalizing security research harms everyone.<br><br>Vendors must acknowledge reports within 5 business days.'),
    art('Art. 54', 'Breach Notification', 'You Must Be Told When You Are Hacked', 'Data breaches affecting personal information must be disclosed to affected persons within 72 hours, with remediation steps and accountability measures.<br><br>Delayed disclosure to protect stock prices is an aggravating factor.'),
    art('Art. 55', 'Right to Offline Functionality', 'Cloud Failure Must Not Erase Life', 'Essential digital services must provide offline-capable alternatives. Dependence on perpetual connectivity for access to personal data violates sovereignty.<br><br>Local-first architecture is the preferred design pattern.'),
    art('Art. 56', 'Prohibition of Preemptive Device Compromise', 'Your Phone Is Not a Surveillance Endpoint', 'States may not require manufacturers to pre-install surveillance software on consumer devices. Supply chain integrity is a human right.<br><br>Citizen devices may not be remotely accessed without judicial warrant.'),
    art('Art. 57', 'Digital Infrastructure Resilience', 'Critical Systems Must Survive Attack', 'States and operators of critical digital infrastructure must maintain redundancy, incident response, and public reporting of major outages affecting rights.<br><br>Ransomware payment from public funds requires transparency review.'),
    art('Art. 58', 'Open Source Security Preference', 'Transparency Builds Trust', 'Public sector procurement must prefer auditable open-source solutions where security-equivalent. Security through obscurity is not a defense.<br><br>Source code for systems processing public data should be publicly reviewable.'),
    art('Art. 59', 'Right to Verify Software Integrity', 'You May Audit What Runs on Your Device', 'Persons have the right to verify that software on their devices matches published source code through reproducible builds and code signing.<br><br>Tamper-evident boot and user-controlled root of trust are protected.'),
    art('Art. 60', 'Cyber Peace Principles', 'Digital War Has Civilian Casualties', 'Offensive cyber operations against civilian infrastructure violate this charter. Critical healthcare, water, power, and financial systems are protected digital spaces.<br><br>Nation-state malware hoarding without disclosure endangers global security.'),
  ]},
  { chapter: 'Chapter VII — Algorithmic Rights', range: [61, 70], articles: [
    art('Art. 61', 'Right to Algorithmic Transparency', 'You Have the Right to Know How Machines Judge You', ''),
    art('Art. 62', 'Protection from Algorithmic Discrimination', 'Algorithmic Bias Is Discrimination — Full Stop', ''),
    art('Art. 63', 'Prohibition of Manipulative Algorithms', 'Your Feed Must Not Be a Weapon', 'Recommendation and ranking algorithms may not be designed to maximize addiction, outrage, or compulsive engagement at the expense of user wellbeing.<br><br>Users must have chronological and algorithm-free feed options on platforms exceeding 10 million users.'),
    art('Art. 64', 'Right to Opt Out of Profiling', 'You Are Not a Prediction', 'Every person may opt out of behavioral profiling, interest inference, and psychographic targeting without loss of core service functionality.<br><br>Profiling opt-out must be as easy as profiling opt-in.'),
    art('Art. 65', 'AI Training Data Consent', 'Your Life Is Not Free Training Data', 'Use of personal data, creative works, or communications to train AI systems requires explicit opt-in consent, with fair compensation mechanisms for commercial use.<br><br>Scraping copyrighted or personal content for model training without consent is prohibited.'),
    art('Art. 66', 'Synthetic Media Labeling', 'Deepfakes Must Be Identified', 'AI-generated media presented as factual must be clearly labeled. Non-consensual intimate synthetic imagery is prohibited.<br><br>Political deepfakes during election periods face enhanced penalties.'),
    art('Art. 67', 'Human Oversight of High-Risk AI', 'Machines Advise, Humans Decide', 'High-risk AI systems—those affecting liberty, health, or livelihood—require human-in-the-loop oversight, kill switches, and incident logging.<br><br>Autonomous weapons systems targeting humans are prohibited.'),
    art('Art. 68', 'Algorithmic Impact Audits', 'Test Before You Deploy on Millions', 'Deployers of algorithmic systems affecting more than 100,000 persons must publish annual bias, accuracy, and harm audits.<br><br>Third-party auditors must have access sufficient to verify claims.'),
    art('Art. 69', 'Right to Contest Automated Decisions', 'Challenge the Machine', 'Every automated adverse decision must include a clear pathway to human review, correction, and explanation within 14 days.<br><br>Class action rights apply to systematic algorithmic harm.'),
    art('Art. 70', 'Open Algorithm Standards', 'Public Interest Algorithms Deserve Public Scrutiny', 'Algorithms used in public services, elections, and judicial support must use open, auditable standards. Trade secret protection does not apply to public-sector algorithms.<br><br>Citizens may request algorithmic audits of government systems.'),
  ]},
  { chapter: 'Chapter VIII — Platform Accountability', range: [71, 80], articles: [
    art('Art. 71', 'Duty of Care for Platforms', 'Size Brings Responsibility', 'Platforms exceeding 10 million active users owe a duty of care to prevent foreseeable harm—including harassment campaigns, viral misinformation with physical consequences, and exploitation of minors.<br><br>Immunity from liability does not extend to willful indifference.'),
    art('Art. 72', 'Interoperability Rights', 'You May Leave and Take Your Network', 'Dominant platforms must provide interoperable APIs enabling users to communicate across platforms and export social graphs.<br><br>Walled gardens that lock in users through network effects violate this article.'),
    art('Art. 73', 'Prohibition of Self-Preferencing', 'The Referee Cannot Play', 'Platforms may not prioritize their own products in search, recommendations, or app stores in ways that harm competitors.<br><br>App store monopolies must allow alternative payment and distribution.'),
    art('Art. 74', 'Advertising Transparency', 'You May Know Who Paid to Influence You', 'All digital political and commercial advertising must disclose funder identity, targeting criteria, and spend. Microtargeting based on sensitive categories is prohibited.<br><br>Ad archives must be publicly searchable for seven years.'),
    art('Art. 75', 'Worker Rights in the Gig Economy', 'Algorithmic Bosses Owe Fairness', 'Gig workers have the right to know how algorithms set pay, assign work, and terminate accounts. Opaque algorithmic management is prohibited.<br><br>Minimum wage and safety standards apply regardless of platform classification.'),
    art('Art. 76', 'Right to Repair and Modify', 'You Own Your Devices', 'Digital locks, DRM, and terms of service may not prevent persons from repairing, modifying, or repurposing devices they own.<br><br>Right to repair extends to software and firmware.'),
    art('Art. 77', 'Prohibition of Dark Patterns', 'Honest Design Only', 'User interfaces that trick, coerce, or manipulate users into actions against their interest are prohibited. Regulatory fines scale with conversion rate of dark patterns.<br><br>Canceling subscriptions must be as easy as starting them.'),
    art('Art. 78', 'Collective Bargaining for Users', 'Users May Organize', 'Users of dominant platforms have the right to organize, collectively negotiate terms of service, and appoint ombudspersons without retaliation.<br><br>Platform union busting violates this article.'),
    art('Art. 79', 'Environmental Disclosure of AI', 'Compute Has a Carbon Cost', 'Operators of large AI systems must disclose energy consumption and carbon footprint. Public sector AI procurement must consider environmental impact.<br><br>Water usage for data centers in drought regions requires community consent.'),
    art('Art. 80', 'Anti-Monopoly Digital Markets', 'Competition Is a Right', 'States must prevent digital market monopolies through structural separation, data portability mandates, and prohibition of killer acquisitions.<br><br>Merger review must assess data concentration risk.'),
  ]},
  { chapter: 'Chapter IX — State & Governance', range: [81, 90], articles: [
    art('Art. 81', 'Limits on State Digital Surveillance', 'Governments Serve Citizens, Not the Reverse', 'State digital surveillance requires judicial warrant naming individuals and crimes. Mass surveillance programs are prohibited regardless of national security claims.<br><br>Surveillance budgets must be publicly disclosed annually.'),
    art('Art. 82', 'Digital Due Process', 'The Fourth Amendment Applies Online', 'Search of digital devices, cloud accounts, and communications requires the same due process as physical search. Border device searches require probable cause.<br><br>Parallel construction from illegal surveillance is prohibited.'),
    art('Art. 83', 'Prohibition of Social Credit Systems', 'Citizens Are Not Scores', 'Government or corporate systems that rank citizens for access to services, travel, or rights based on behavioral scoring are prohibited.<br><br>Reputation systems without appeal and correction rights violate this article.'),
    art('Art. 84', 'E-Government Transparency', 'Public Services Must Be Open', 'Government digital services must be open source where security allows, accessible without proprietary software, and usable offline where feasible.<br><br>Citizens may not be forced onto single-vendor platforms for civic participation.'),
    art('Art. 85', 'Digital Voting Integrity', 'Democracy Requires Verifiable Systems', 'Electronic voting must be auditable, recountable, and open to independent verification. Online-only voting without paper backup is prohibited for national elections.<br><br>Voter data may not be used for non-electoral purposes.'),
    art('Art. 86', 'Protection from Extraterritorial Overreach', 'No Empire in the Cloud', 'States may not assert jurisdiction over foreign persons\' data without treaty basis and proportionality. Cloud providers must resist unlawful foreign data orders.<br><br>Data localization requirements must respect human rights.'),
    art('Art. 87', 'Digital Rights Ombudsman', 'Every Nation Needs an Advocate', 'States shall establish independent digital rights ombudspersons with authority to investigate complaints, issue binding recommendations, and refer violations for prosecution.<br><br>Ombudspersons must be funded independently of surveillance agencies.'),
    art('Art. 88', 'Prohibition of Forced Device Access', 'Passwords Stay With the Person', 'States may not compel persons to disclose encryption passwords, device passcodes, or biometric unlock except with judicial order in specific criminal investigations.<br><br>Contempt charges for silence protected where self-incrimination applies.'),
    art('Art. 89', 'Public Interest Digital Defense', 'Legal Aid for Digital Rights', 'States must fund legal aid for persons pursuing digital rights claims against powerful entities.<br><br>Public interest litigation receives fee-shifting when rights violations are proven.'),
    art('Art. 90', 'Democratic Oversight of Spyware', 'Pegasus Has Victims', 'Government purchase and use of commercial spyware requires legislative approval, judicial oversight, and public annual reporting of targets and outcomes.<br><br>Zero-day stockpiling by governments endangers global security.'),
  ]},
  { chapter: 'Chapter X — Global & Cross-Border', range: [91, 100], articles: [
    art('Art. 91', 'Universal Jurisdiction for Digital Harm', 'Borders Do Not Block Justice', 'Courts may exercise jurisdiction over digital rights violations affecting their residents regardless of where the violating entity is headquartered.<br><br>Victims may sue in their home jurisdiction.'),
    art('Art. 92', 'Data Transfer Adequacy', 'Your Data Cannot Be Exported to Surveillance States', 'Transfer of personal data to jurisdictions without adequate privacy protections is prohibited unless person-initiated and informed.<br><br>Adequacy assessments must be public and revocable.'),
    art('Art. 93', 'Global Digital Rights Treaty Framework', 'SherpaCarta as Model Law', 'Nations are encouraged to adopt SherpaCarta articles as binding national law through treaty, legislation, or constitutional amendment.<br><br>International monitoring body recommended for compliance reporting.'),
    art('Art. 94', 'Protection of Digital Refugees', 'Exile From Digital Life Deserves Sanctuary', 'Persons persecuted for digital expression have the right to seek asylum. States must not deport persons to jurisdictions where digital persecution is likely.<br><br>VPN and encryption tools for refugees must not be restricted.'),
    art('Art. 95', 'Development Rights Online', 'The Global South Must Not Be Digital Colonies', 'Developing nations have the right to digital infrastructure sovereignty, local data storage, and freedom from extractive data colonialism.<br><br>Technology transfer and open standards support required from dominant nations.'),
    art('Art. 96', 'Multilingual Internet Governance', 'ICANN Serves Humanity', 'Internet governance institutions must reflect global demographic diversity. English-only policy development is insufficient.<br><br>Nations may establish multilingual root governance participation.'),
    art('Art. 97', 'Cross-Border Evidence Protocols', 'Justice Without Data Raids', 'Cross-border digital evidence requests must follow treaty procedures with proportionality review. Bulk data requests are prohibited.<br><br>Mutual legal assistance must not become mass surveillance pipeline.'),
    art('Art. 98', 'Sanctions and Digital Rights', 'Punish Regimes, Not People', 'Sanctions may not block access to communication tools, encryption, or human rights documentation for civilian populations.<br><br>General license for digital rights tools in sanctioned regions required.'),
    art('Art. 99', 'Corporate Extraterritorial Accountability', 'Multinationals Answer to All They Harm', 'Corporations operating globally are accountable in every jurisdiction where they cause digital rights harm, regardless of incorporation location.<br><br>Forum shopping to evade liability is prohibited.'),
    art('Art. 100', 'Solidarity Among Signatories', 'A Global Movement, Not a Website', 'Signatories to SherpaCarta form a global solidarity network obligated to support one another\'s digital rights advocacy, translation, and legal defense.<br><br>Local chapters may form with autonomy under charter principles.'),
  ]},
  { chapter: 'Chapter XI — Enforcement & Remedies', range: [101, 114], articles: [
    art('Art. 101', 'Right to Digital Remedy', 'Every Violation Entitles the Victim to Remedy', ''),
    art('Art. 102', 'Class Action and Collective Redress', 'Millions Harmed, One Lawsuit', 'Systematic digital rights violations affecting groups qualify for collective redress without requiring each victim to litigate individually.<br><br>Representative actions by civil society organizations are authorized.'),
    art('Art. 103', 'Punitive Damages for Willful Violations', 'Profit Must Not Exceed Penalty', 'Willful, repeated, or profit-motivated digital rights violations face punitive damages up to 4% of global annual revenue.<br><br>Executive personal liability applies for directed violations.'),
    art('Art. 104', 'Injunctive Relief', 'Stop the Harm First', 'Courts may issue immediate injunctions halting ongoing digital rights violations without requiring victims to prove damages first.<br><br>Temporary restraining orders available within 48 hours for surveillance emergencies.'),
    art('Art. 105', 'Whistleblower Rewards', 'Incentivize Truth', 'Persons who expose systematic digital rights violations may receive a portion of recovered damages or fines.<br><br>Retaliation against whistleblowers triggers automatic investigation.'),
    art('Art. 106', 'Public Enforcement Actions', 'Regulators Must Act', 'Data protection authorities must investigate credible complaints within 30 days and publish outcomes. Regulatory capture is an actionable violation.<br><br>Underfunded enforcement is not an excuse for inaction.'),
    art('Art. 107', 'Sunset of Immunity Provisions', 'Section 230 Must Evolve', 'Platform liability immunity does not extend to willful facilitation of trafficking, exploitation, or systematic rights violations with actual knowledge.<br><br>Immunity frameworks must be reviewed every five years.'),
    art('Art. 108', 'Victim Compensation Funds', 'Harm Creates Obligation to Repair', 'Fines from digital rights violations fund victim compensation pools administered transparently.<br><br>Priority to marginalized communities disproportionately harmed.'),
    art('Art. 109', 'International Enforcement Cooperation', 'Justice Without Borders', 'Nations shall cooperate in enforcement against digital rights violators through information sharing, asset freezing, and extradition where appropriate.<br><br>Safe havens for digital rights violators should be eliminated through treaty.'),
    art('Art. 110', 'Charter Supremacy Clause', 'Rights Over Profits', 'When SherpaCarta conflicts with commercial contracts, terms of service, or trade agreements, the charter prevails to the extent of the conflict.<br><br>Waivers of fundamental digital rights in adhesion contracts are void.'),
    art('Art. 111', 'Signatory Registry', 'Public Record of Commitment', 'Organizations and governments adopting SherpaCarta must register publicly, report compliance annually, and accept community review.<br><br>False adoption claims are actionable misrepresentation.'),
    art('Art. 112', 'Education and Enforcement Funding', 'Rights Require Resources', 'States adopting SherpaCarta commit to funding digital rights education, legal aid, and enforcement at minimum 0.1% of digital economy GDP.<br><br>Private signatories contribute proportionally to revenue.'),
    art('Art. 113', 'Non-Regression Principle', 'Rights Never Go Backward', 'No law, policy, or terms of service may reduce digital rights below SherpaCarta baseline once adopted.<br><br>Regression triggers automatic review and public hearing.'),
    art('Art. 114', 'Living Charter Principle', 'This Document Grows With Technology', ''),
  ]},
];

const charter = defs.map(({ chapter, articles }) => ({ chapter, articles }));
const articleCount = charter.reduce((n, ch) => n + ch.articles.length, 0) - 1; // minus P.1

mkdirSync(join(root, 'data'), { recursive: true });
writeFileSync(join(root, 'data/charter.json'), JSON.stringify({
  version: '2.0',
  build: '20260707-667',
  articleCount: 114,
  preambleCount: 1,
  totalEntries: articleCount,
  chapters: charter,
}, null, 2));

const publicData = join(root, 'public/data');
mkdirSync(publicData, { recursive: true });
writeFileSync(join(publicData, 'charter.json'), readFileSync(join(root, 'data/charter.json')));

console.log(`Charter generated: ${articleCount} entries (${114} articles + preamble)`);