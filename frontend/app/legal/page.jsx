'use client'

import { useState } from 'react'
import { 
  Shield, FileText, Lock, Eye, AlertCircle, Scale, 
  UserCheck, Globe, Server, Mail, ChevronDown, ChevronUp 
} from 'lucide-react'

export default function TermsPrivacyPage() {
  const [activeTab, setActiveTab] = useState('terms')
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 pt-20">
      {/* Header */}
      <header className=" z-50 backdrop-blur-lg bg-black border-0 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black border rounded-lg">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-6xl md:text-4xl font-semibold text-white gradient-title">Legal Policy</h1>
              <p className="text-xs sm:text-sm text-gray-500">Transparency & Accountability</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[73px] sm:top-[85px] z-40 border-0  bg-none backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
              { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-gray-400 text-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-400'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === 'terms' ? 'Terms' : 'Privacy'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'terms' ? 
          <TermsOfService expandedSections={expandedSections} toggleSection={toggleSection} /> : 
          <PrivacyPolicy expandedSections={expandedSections} toggleSection={toggleSection} />
        }
      </div>

      {/* Footer */}
      <footer className="border-t  mt-12 sm:mt-20 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center text-xs sm:text-sm text-white">
          <p>Last updated: November 30, 2025</p>
          <a href="mailto:aispireteam@gmail.com" className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-white hover:text-white transition-colors">
            <Mail className="w-4 h-4" />
            aispireteam@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}

function TermsOfService({ expandedSections, toggleSection }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Introduction */}
      <div className="bg-black border  rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="p-2 bg-black rounded-lg">
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white mb-2">Service Agreement</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              These terms outline your responsibilities and our commitments regarding platform usage. By accessing our services, you acknowledge acceptance of these conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Acceptance of Terms */}
      <Section
        icon={<UserCheck className="w-5 h-5" />}
        title="1. Acceptance of Terms"
        expanded={expandedSections['terms-1']}
        onToggle={() => toggleSection('terms-1')}
      >
        <div className="space-y-4">
          <p className="text-white text-xs sm:text-sm">
            By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
          </p>
          <div className="bg-black border  rounded-lg p-3 sm:p-4">
            <h4 className="text-white font-medium text-xs sm:text-sm mb-3">You represent and warrant that:</h4>
            <ul className="space-y-2 text-white text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>You are at least 18 years of age or have parental consent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>You have the legal capacity to enter into binding agreements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>All information you provide is accurate and current</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                <span>You will comply with all applicable laws and regulations</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Section 2: User Accounts */}
      <Section
        icon={<Scale className="w-5 h-5" />}
        title="2. User Accounts and Responsibilities"
        expanded={expandedSections['terms-2']}
        onToggle={() => toggleSection('terms-2')}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-black border  rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                You Must
              </h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>• Provide accurate registration information</li>
                <li>• Keep your password secure</li>
                <li>• Notify us of unauthorized access</li>
                <li>• Use the service lawfully</li>
              </ul>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                You Must Not
              </h4>
              <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
                <li>• Share your account credentials</li>
                <li>• Create multiple accounts</li>
                <li>• Impersonate others</li>
                <li>• Violate intellectual property rights</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Acceptable Use */}
      <Section
        icon={<Shield className="w-5 h-5" />}
        title="3. Acceptable Use Policy"
        expanded={expandedSections['terms-3']}
        onToggle={() => toggleSection('terms-3')}
      >
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          You agree not to use our services for any unlawful purpose or in any way that could harm our platform, users, or reputation.
        </p>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 sm:p-4">
          <h4 className="text-red-400 font-medium text-xs sm:text-sm mb-3">Prohibited Activities Include:</h4>
          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            <li>• Transmitting malware, viruses, or harmful code</li>
            <li>• Attempting to gain unauthorized access to systems</li>
            <li>• Harassing, abusing, or threatening other users</li>
            <li>• Posting illegal, defamatory, or offensive content</li>
            <li>• Engaging in spam or unsolicited marketing</li>
            <li>• Scraping or automated data collection without permission</li>
          </ul>
        </div>
      </Section>

      {/* Section 4: Intellectual Property */}
      <Section
        icon={<FileText className="w-5 h-5" />}
        title="4. Intellectual Property Rights"
        expanded={expandedSections['terms-4']}
        onToggle={() => toggleSection('terms-4')}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by us or our licensors and protected by copyright, trademark, and other intellectual property laws.
          </p>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
            <h4 className="text-white font-medium text-xs sm:text-sm mb-3">Limited License</h4>
            <p className="text-gray-400 text-xs sm:text-sm">
              We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal or internal business purposes, subject to these terms.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 5: Disclaimers */}
      <Section
        icon={<AlertCircle className="w-5 h-5" />}
        title="5. Disclaimers and Limitation of Liability"
        expanded={expandedSections['terms-5']}
        onToggle={() => toggleSection('terms-5')}
      >
        <div className="space-y-4">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Our services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
            </p>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
          </p>
        </div>
      </Section>

      {/* Section 6: Termination */}
      <Section
        icon={<Scale className="w-5 h-5" />}
        title="6. Termination"
        expanded={expandedSections['terms-6']}
        onToggle={() => toggleSection('terms-6')}
      >
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          We reserve the right to suspend or terminate your account at any time, with or without notice, for any violation of these terms or for any other reason at our sole discretion.
        </p>
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            Upon termination, your right to use our services will immediately cease. We may delete your account data in accordance with our data retention policies.
          </p>
        </div>
      </Section>

      {/* Section 7: Terms Updates */}
      <Section
        icon={<Globe className="w-5 h-5" />}
        title="7. Changes to Terms"
        expanded={expandedSections['terms-7']}
        onToggle={() => toggleSection('terms-7')}
      >
        <p className="text-gray-400 text-xs sm:text-sm">
          We may update these terms from time to time. We will notify you of any material changes by posting the new terms on our platform and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the modified terms.
        </p>
      </Section>
    </div>
  )
}

function PrivacyPolicy({ expandedSections, toggleSection }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Introduction */}
      <div className="bg-black border  rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="p-2 bg-black rounded-lg">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white mb-2">Data Protection Policy</h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              We maintain strict data protection standards to safeguard your personal information while delivering essential service functionality.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Information Collection */}
      <Section
        icon={<Eye className="w-5 h-5" />}
        title="1. Information We Collect"
        expanded={expandedSections['privacy-1']}
        onToggle={() => toggleSection('privacy-1')}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Data collection is minimized and purposeful, focusing only on information required for service delivery.
          </p>
          <div className="space-y-3">
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Directly Provided Information
              </h4>
              <ul className="space-y-1 text-gray-400 text-xs sm:text-sm ml-4">
                <li>• Account credentials and profile details</li>
                <li>• Transaction and billing information</li>
                <li>• Support and communication records</li>
                <li>• Feedback and survey responses</li>
              </ul>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Automatically Collected Data
              </h4>
              <ul className="space-y-1 text-gray-400 text-xs sm:text-sm ml-4">
                <li>• IP address and network information</li>
                <li>• Browser type and device specifications</li>
                <li>• Usage patterns and interaction metrics</li>
                <li>• Cookie-based preferences and settings</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: Data Usage */}
      <Section
        icon={<Server className="w-5 h-5" />}
        title="2. How We Use Your Information"
        expanded={expandedSections['privacy-2']}
        onToggle={() => toggleSection('privacy-2')}
      >
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          We process your data only for explicit, legitimate purposes aligned with our service delivery.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Service provision and account management',
            'Security monitoring and fraud prevention',
            'Product improvement and feature development',
            'Customer support and communication',
            'Legal compliance and regulatory obligations',
            'Aggregated analytics and research',
            'Personalized user experience'
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-gray-900/30 border border-gray-800 rounded-lg p-3">
              <span className="text-indigo-400 text-xs sm:text-sm mt-0.5">✓</span>
              <span className="text-gray-400 text-xs sm:text-sm">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3: Data Sharing */}
      <Section
        icon={<Lock className="w-5 h-5" />}
        title="3. Data Sharing and Disclosure"
        expanded={expandedSections['privacy-3']}
        onToggle={() => toggleSection('privacy-3')}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            We maintain strict control over data sharing and only disclose information under these conditions:
          </p>
          <div className="space-y-3">
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-2">Authorized Recipients</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                Data may be shared with trusted service providers who assist in platform operations, including payment processors, cloud hosts, and analytics tools.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-2">Compulsory Disclosure</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                We may disclose data when required by law, court order, or to protect our rights, users, or public safety.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-white font-medium text-xs sm:text-sm mb-2">Business Transactions</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                In mergers or acquisitions, user data may be transferred as a business asset with appropriate safeguards.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Security Measures */}
      <Section
        icon={<Shield className="w-5 h-5" />}
        title="4. Data Security"
        expanded={expandedSections['privacy-4']}
        onToggle={() => toggleSection('privacy-4')}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            We implement comprehensive security protocols to protect your data against unauthorized access or misuse.
          </p>
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
            <h4 className="text-white font-medium text-xs sm:text-sm mb-3">Security Protocols</h4>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li>• End-to-end encryption for sensitive transmissions</li>
              <li>• Regular security audits and penetration testing</li>
              <li>• Automated threat detection and response systems</li>
              <li>• Strict access controls and multi-factor authentication</li>
              <li>• Employee security training and compliance programs</li>
              <li>• Incident response and breach notification procedures</li>
            </ul>
          </div>
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm">
              <strong className="text-yellow-400">Note:</strong> While we employ robust security measures, no digital system can guarantee absolute protection against all potential threats.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 5: User Rights */}
      <Section
        icon={<UserCheck className="w-5 h-5" />}
        title="5. Your Privacy Rights"
        expanded={expandedSections['privacy-5']}
        onToggle={() => toggleSection('privacy-5')}
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            You have control over your personal data and can exercise these rights:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'Access', desc: 'Request a complete copy of your personal data' },
              { title: 'Correction', desc: 'Update inaccurate or incomplete information' },
              { title: 'Deletion', desc: 'Request removal of your data (where permitted)' },
              { title: 'Portability', desc: 'Receive your data in a transferable format' },
              { title: 'Restriction', desc: 'Limit processing in specific circumstances' },
              { title: 'Objection', desc: 'Opt-out of direct marketing communications' }
            ].map((right, idx) => (
              <div key={idx} className="bg-black border rounded-lg p-3 sm:p-4">
                <h4 className="text-white font-medium text-xs sm:text-sm mb-1">{right.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{right.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@company.com" className="text-indigo-400 hover:underline">privacy@company.com</a>. 
              We will respond within 30 days of receipt.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 6: International Transfers */}
      <Section
        icon={<Globe className="w-5 h-5" />}
        title="6. International Data Transfers"
        expanded={expandedSections['privacy-6']}
        onToggle={() => toggleSection('privacy-6')}
      >
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          Data may be transferred and processed globally to support our operations.
        </p>
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
          <p className="text-gray-400 text-xs sm:text-sm">
            We implement appropriate safeguards such as Standard Contractual Clauses and other legal mechanisms to protect your data during international transfers in compliance with applicable laws.
          </p>
        </div>
      </Section>

      {/* Section 7: Data Retention */}
      <Section
        icon={<FileText className="w-5 h-5" />}
        title="7. Data Retention"
        expanded={expandedSections['privacy-7']}
        onToggle={() => toggleSection('privacy-7')}
      >
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          We retain your data only as long as necessary for the purposes outlined above or as required by law.
        </p>
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-3 sm:p-4">
          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            <li>• Account data: Retained while account remains active</li>
            <li>• Transaction records: Kept for 7 years for compliance</li>
            <li>• Support communications: Archived for 3 years</li>
            <li>• Marketing preferences: Retained until opt-out</li>
            <li>• Security logs: Maintained for 2 years</li>
          </ul>
        </div>
      </Section>

      {/* Section 8: Children's Privacy */}
      <Section
        icon={<AlertCircle className="w-5 h-5" />}
        title="8. Children's Privacy"
        expanded={expandedSections['privacy-8']}
        onToggle={() => toggleSection('privacy-8')}
      >
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 sm:p-4">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Our services are not intended for users under 18 years old. We do not knowingly collect data from children. If we discover such data has been collected, we will promptly delete it and notify relevant authorities if required.
          </p>
        </div>
      </Section>

      {/* Section 9: Policy Updates */}
      <Section
        icon={<Lock className="w-5 h-5" />}
        title="9. Updates to This Policy"
        expanded={expandedSections['privacy-9']}
        onToggle={() => toggleSection('privacy-9')}
      >
        <p className="text-gray-400 text-xs sm:text-sm">
          This policy may be updated periodically to reflect operational changes or legal requirements. Significant updates will be posted here with a revised 'Last Updated' date. Continued use of our services constitutes acceptance of modified policies.
        </p>
      </Section>
    </div>
  )
}

function Section({ icon, title, children, expanded, onToggle }) {
  return (
    <div className="bg-black border  rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-black/40 rounded-lg">
            {icon}
          </div>
          <h3 className="text-sm sm:text-base font-medium text-gray-200 text-left">{title}</h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-gray-800">
          {children}
        </div>
      )}
    </div>
  )
}