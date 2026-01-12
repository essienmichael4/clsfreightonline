import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

const sections = [
  { id: "collection", title: "Data Collection" },
  { id: "uses", title: "Data Uses" },
  { id: "location", title: "Data Location and Retention" },
  { id: "disclosure", title: "Data Disclosure" },
  { id: "cookies", title: "Cookies and Tracking Technologies" },
  { id: "communication", title: "Communications" },
  { id: "security", title: "Data Security" },
  { id: "rights", title: "Your Privacy Rights" },
  { id: "roles", title: "Roles and Responsibilities" },
  { id: "notices", title: "Additional Notices & Contact Details" },
];

const dataProcessingPurposes = [
  {
    purpose: [
      "Authenticate your identity and provide access to our services",
    ],
    basis: ["Performance of a contract"],
  },
  {
    purpose: [
      "Facilitate, operate, and provide our services",
      "Provide customer service and technical support",
    ],
    basis: ["Performance of a contract (where applicable)", "Legitimate interests"],
  },
  {
    purpose: [
      "Support and enhance our data security measures, including prevention of fraud, errors, or illegal activity",
    ],
    basis: ["Performance of a contract (where applicable)", "Legal obligations", "Legitimate interests"],
  },
  {
    purpose: [
      "Understand how our services are used to improve user experience and overall performance",
      "Optimize marketing campaigns, communications, and ad management",
      "Explore and pursue growth opportunities",
      "Facilitate, sponsor, and offer events, contests, and promotions",
    ],
    basis: ["Consent (where applicable)", "Legitimate interests"],
  },
  {
    purpose: [
      "Contact you directly with personalized service-related messages",
    ],
    basis: ["Performance of a contract (where applicable)", "Consent (where applicable)", "Legitimate interests"],
  },
  {
    purpose: [
      "Evaluate, monitor, study, and analyze service usage to diagnose issues and improve services",
      "Create aggregated or anonymized data for research and service improvements",
      "Enforce agreements, resolve disputes, and protect business interests",
    ],
    basis: ["Legitimate interests"],
  },
];


const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-8 md:flex-row">
                
                {/* 📌 Sidebar / TOC */}
                <aside className="md:w-1/4">
                    <div className="sticky top-24 rounded-lg border bg-gray-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-700">
                        On this page
                        </h3>
                        <ul className="space-y-2 text-sm">
                        {sections.map(section => (
                            <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                className="text-gray-600 hover:text-cyan-700 transition"
                            >
                                {section.title}
                            </a>
                            </li>
                        ))}
                        </ul>
                    </div>
                </aside>
                {/* 📄 Content */}
                <main className="md:w-3/4">
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    <p className="mt-2 text-sm text-gray-500">Last updated: January 2026</p>
                    <Separator className="my-6 h-px bg-gray-200" />
                    
                    <div className="space-y-6 text-sm leading-relaxed text-gray-700">
                        <p>We at CLixma Supply Chain Group Limited (CSL) (together with its affiliated companies - "we", "our" or "us") develop and operate a Freight and Logistics platform, Sourcing and Procurment Platform, Commerce platform, Forex platform as well as additional services (collectively - "Solutions") - each designed to help customer(s) streamline their supply chain operations.</p>
                        <p>This Privacy Policy describes our practises regarding the collection, storage, use, and disclosure of data relating to identifiable individuals ("personal data" or "personal information", and "data subjects", respectively), who:</p>
                        <ul className="list-disc list-inside">
                            <li>visit or interact with our website ("Visitors"), including <a className="text-cyan-700" href="www.cslfreightgh.com">www.cslfreightgh.com</a>, <a className="text-cyan-700" href="www.rmbdeals.com">www.rmbdeals.com</a> and any other website, webpage, e-mail, text message or online ad under our control.</li>
                            <li>join, vist or otherwise interact with our services
                                {/* , enabling them to connect and engage with other users. */}
                            </li>
                            <li>interact with us with respect to our solutions via various marketing platforms, channels, events and or other business activities.</li>
                            <li>are registered to our services.</li>
                        </ul>
                        <p>The activities described above are the services to which this Privacy Policy applies. Please note that this Privacy Policy does not apply to any third-party websites or services that may be linked to our website or services. Also, the Privacy Policy does not cover our practices regarding individuals who use the Solutions at our Customer's directions.</p>
                        <p>Specifically, this Privacy Policy describes our practices regarding:</p>
                        <ul>
                            {sections.map(section => (
                                <li key={section.id}>{section.title}</li>
                            ))}
                        </ul>
                        <p>Please read this Privacy Policy carefully to understand how we collect, use, and protect your personal information and agree to it.</p>
                        <section className="space-y-4" id="collection">
                            <h2 className="text-xl font-semibold">1. Data Collection</h2>
                            <p>We collect various types of personal data from and about you when you use our website, services, or interact with us. This may include:</p>
                            <ul className="list-disc list-inside">
                                <li>Contact Information: such as your name, email address, phone number, and mailing address.</li>
                                <li>Account Information: such as your username, password, and other registration details.</li>
                                <li>Payment Information: such as your credit card details or other payment method information.</li>
                                <li>Usage Data: such as information about how you use our website and services, including your IP address, browser type, and operating system.</li>
                                <li>Communications: such as any messages or communications you send to us.</li>
                            </ul>
                            <p>We may collect this information directly from you when you provide it to us, automatically through your use of our website and services, or from third-party sources.</p>
                        </section>
                        <section className="space-y-4" id="uses">
                            <h2 className="text-xl font-semibold">2. Data Uses</h2>
                            <p>We use your personal data as neccessary for the following and in reliance on the lawful base as further described below:</p>
                             <div className="border rounded-md overflow-hidden">
                                {/* Header */}
                                <div className="hidden md:flex py-2 font-semibold border-b bg-gray-50">
                                    <div className="w-2/3 px-4">Purpose</div>
                                    <div className="w-1/3 px-4">Lawful basis for processing</div>
                                </div>

                                {dataProcessingPurposes.map((item, idx) => (
                                    <div
                                    key={idx}
                                    className={`flex flex-col md:flex-row py-2 ${
                                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-gray-100 transition-colors`}
                                    >
                                    {/* Purpose */}
                                    <div className="w-full md:w-2/3 px-4 space-y-1">
                                        <p className="font-semibold md:hidden mb-1">Purpose:</p>
                                        {item.purpose.map((p, i) => (
                                        <p key={i}>{`- ${p}`}</p>
                                        ))}
                                    </div>

                                    {/* Lawful Basis */}
                                    <div className="w-full md:w-1/3 px-4 mt-2 md:mt-0 space-y-1">
                                        <p className="font-semibold md:hidden mb-1">Lawful basis:</p>
                                        {item.basis.map((b, i) => (
                                        <p key={i}>{b}</p>
                                        ))}
                                    </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4">
                            If you are using our services in Ghana or any other jurisdiction with data protection laws, including the Ghana Data Protection Act, 2012 (Act 843), the EU General Data Protection Regulation (GDPR), or the California Consumer Privacy Act (CCPA), your acceptance of our{" "}
                            <span className="text-cyan-700">Terms of Use</span> and this Privacy Policy constitutes your consent for us to collect, store, and process your personal data in accordance with this Privacy Policy and applicable laws. 
                            Providing your personal data is voluntary; however, without it, we may be unable to provide the full range of our services or deliver the best user experience. 
                            If you do not wish to provide your personal data or have it processed by us, please refrain from using our services.
                            </p>                        
                        </section>
                        <section className="space-y-4" id="location">
                            <h2 className="text-xl font-semibold">3. Data Location and Retention</h2>
                            
                            <p>
                                <span className="font-bold">Data Location:</span> Your personal data is maintained, stored, and processed by us and our authorized Service Providers in Ghana, the US, EU, China, and other locations as reasonably necessary to deliver our services or as required by law.
                            </p>
                            
                            <p>
                                We ensure that your personal data is handled in accordance with this Privacy Policy, the Ghana Data Protection Act, 2012 (Act 843), GDPR, CCPA, and industry best practices, including using contractual and technical safeguards to protect your information where required.
                            </p>
                            
                            <p>
                                <span className="font-bold">Data Retention:</span> We retain personal data only as long as necessary to provide services, maintain business relationships, comply with legal obligations, or resolve potential disputes. Once personal data is no longer needed, we securely delete, anonymize, or restrict access to it, unless applicable laws or agreements require otherwise.
                            </p>
                            
                            <p>
                                If you have questions regarding our data retention practices, please contact us at <a href="mailto:privacy@cslfreight.com" className="text-cyan-700">privacy@cslfreight.com</a>.
                            </p>
                        </section>

                        <section className="space-y-4" id="disclosure">
                            <h2 className="text-xl font-semibold">4. Data Disclosure</h2>
                            <p>We may disclose your personal data to third parties in the following circumstances:</p>
                            <ul className="list-disc list-inside">
                                <li>to our business partners, service providers, and other third parties who assist us in providing our services or performing business functions on our behalf;</li>
                                <li>to comply with legal obligations or to protect our rights and interests;</li>
                                <li>to enforce our agreements with you, resolve disputes, or protect our business interests and the interests and rights of our business partners.</li>
                            </ul>
                            <p>
                                <span className="font-bold">Service Providers:</span> We engage selected third-party companies and individuals to support our business operations. These may include providers of hosting and server services, communications and content delivery networks (CDNs), cybersecurity, billing and payment processing, web analytics, fraud detection, email and communication distribution, marketing and monitoring, customer support (including ticketing systems and chatbots), and legal, compliance, or financial advisory services (collectively, <span className="font-bold">Service Providers</span>). All Service Providers are required to process your data in accordance with applicable data protection laws.
                            </p>
                            <p>
                                <span className="font-bold">Partnerships:</span> We may work with selected business partners, resellers, distributors, or providers of professional services (collectively, <span className="font-bold">Partners</span>) to enhance our services and provide tailored experiences. Relevant data may be shared with Partners to enable them to engage with you regarding the services we provide. Any interaction you have directly with a Partner that is not coordinated by us is subject to their own terms and privacy practices.
                            </p>

                            <p>
                                <span className="font-bold">Event Partners:</span> If you register for events hosted, organized, or sponsored by us, we may share your registration information with the event organizers, service providers, speakers, or sponsors (collectively, <span className="font-bold">Event Partners</span>) to facilitate the event and provide relevant updates or offers. This information will be handled in accordance with applicable data protection laws.
                            </p>
                            <p>
                                <span className="font-bold">Disclosing Feedback or Recommendations:</span> If you submit a public review, feedback, or testimonial on our services, we may display it to other users or service participants. If you wish to remove your public feedback, please contact us at <a href="mailto:contact@cslfreight.com" className="text-cyan-700">contact@cslfreight.com</a>.
                            </p>

                            <p>
                                <span className="font-bold">Due Diligence and Risk Screening:</span> When processing personal data in relation to our Customers, vendors, or partners, we may share relevant information with compliance providers to meet legal or regulatory obligations, including identity verification, anti-money laundering, counter-terrorist financing checks, and fraud prevention, in accordance with applicable law.
                            </p>

                            <p>
                                <span className="font-bold">Legal Compliance and Protecting Rights:</span> We may disclose personal data to government or law enforcement authorities, or other parties, where required by law, to investigate potential illegal activities, or to protect the rights, safety, or property of our Users, Customers, or the public.
                            </p>

                            <p>
                                <span className="font-bold">CSL Subsidiaries and Affiliates:</span> Personal data may be shared internally with CSL subsidiaries and affiliates for the purposes described in this Privacy Policy. In the event of ownership or structural changes, your personal data may be transferred to successors or assignees, and you will be notified where required by law.
                            </p>

                            <p>For the avoidance of doubt, we may also disclose your personal data pursuant to your explicit approval or if we are legally obligated to do so, or if we have successfully rendered such data as non-personal and anonymous. We may transfer, diclose or otherwise use non-personal data at our sole discretion and without the need of any further consent or approval.</p>
                        </section>
                        <section className="space-y-4" id="cookies">
                            <h2 className="text-xl font-semibold">5. Cookies and Tracking Technologies</h2>
                            <p>We use cookies and similar tracking technologies to enhance your experience on our services and to collect information about how you use our services. You can manage your cookie preferences through your browser settings. For more information about the types of cookies we use, please see our <Link to="/cookies-policy" className="text-cyan-700">Cookie Policy</Link>.</p>
                        </section>
                        <section className="space-y-4" id="communication">
                            <h2 className="text-xl font-semibold">6. Communication Preferences</h2>
                            
                            <p>
                                <span className="font-bold">Service Communications:</span> We may send you messages related to your account, transactions, or use of our services. These communications are necessary for you to access and use our services and cannot be opted out of.
                            </p>

                            <p>
                                <span className="font-bold">Promotional Communications:</span> We may also send you information about new features, promotions, events, or other updates that may interest you. You can manage your promotional communication preferences at any time by updating your account settings or contacting us at 
                                <a href="mailto:contact@cslfreight.com" className="text-cyan-700">contact@cslfreight.com</a>.
                            </p>
                        </section>

                        <section className="space-y-4" id="security">
                            <h2 className="text-xl font-semibold">7. Data Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, use, or disclosure. These measures may include encryption, access controls, and regular security assessments. Regardless, no security measure can guarantee 100% protection of your personal data stored with us or with any third party as describe in <a href="#disclosure" className="text-cyan-700">Section 4</a> above.</p>
                        </section>
                        <section className="space-y-4" id="security">
                            <h2 className="text-xl font-semibold">8. Your Rights</h2>
                            <p>Under the Ghana Data Protection Act, 2012 (Act 843), and where applicable the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), you have the following rights regarding your personal data:</p>
                            <ul className="list-disc list-inside">
                                <li><span>Right to Access: </span> You may request access to the personal data we hold about you and receive information about how we process it.</li>
                                <li><span>Right to Rectification: </span> You may request correction of inaccurate or incomplete personal data we hold about you.</li>
                                <li><span>Right to Erasure: </span> You may request deletion of your personal data, subject to certain conditions.</li>
                                <li><span>Right to Restrict Processing: </span> You may request restriction of processing of your personal data under certain circumstances.</li>
                                <li><span>Right to Data Portability: </span> You may request transfer of your personal data in a structured, commonly used format.</li>
                                <li><span>Right to Object: </span> You may object to processing of your personal data in certain circumstances.</li>
                            </ul>
                            <p>We may retain certain information where required by law or for legitimate business purposes. You may exercise these rights by contacting us at <a href="mailto:contact@cslfreight.com" className="text-cyan-700">contact@cslfreight.com</a>.</p>
                        </section>
                        <section className="space-y-4" id="roles">
                            <h2 className="text-xl font-semibold">9. Roles and Responsibilities</h2>
                            <p>We act as a data controller with respect to the personal data we collect and process through our services. As a data controller, we are responsible for determining the purposes and means of processing your personal data. We may also act as a data processor on behalf of our Customers when processing personal data in accordance with their instructions and for the purposes specified by them. In such cases, our Customers will be the data controllers and will be responsible for complying with applicable data protection laws. CSL is responsible for ensuring that personal data is collected, used, stored, and protected in accordance with applicable data protection laws, including the Ghana Data Protection Act, 2012 (Act 843).</p>
                        </section>
                        <section className="space-y-4" id="notices">
                            <h2 className="text-xl font-semibold">10. Additional Notices & Contact Details</h2>
                            <p><span className="font-bold">Updates and Amendments: </span>We may update and amend this Privacy policy from time to time by publishing the updated version on our Services. The amended policy will be effective immediately upon publication. Your continued use of our Services after any such changes constitutes your acceptance of the revised Privacy Policy.</p>
                            <p><span className="font-bold">External Links: </span>Our Services may contain links to external websites or services that are not operated by us. We are not responsible for the content or privacy practices of these third-party sites and do not assume any responsibility for their operations. We encourage you to review the privacy policies of any third-party websites or services you visit.</p>
                            <p><span className="font-bold">Children's Privacy: </span>Our services are not directed to individuals under the age of 13 (or higher age as may be required in your jurisdiction), and we do not knowingly collect personal data from children without verifiable parental consent. If we become aware that we have collected personal data from a child without such consent, we will take steps to delete the information as soon as possible. If you believe that we may have collected personal data from a child without parental consent, please contact us at <a href="mailto:contact@cslfreight.com" className="text-cyan-700">contact@cslfreight.com</a>.</p>
                            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
                            <p>CLixma Supply Chain Group Limited<br/>
                            Email: <a href="mailto:contact@cslfreight.com" className="text-cyan-700">contact@cslfreight.com</a></p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default PrivacyPolicy
