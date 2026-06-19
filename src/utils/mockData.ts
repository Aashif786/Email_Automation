import { EmailItem } from '../types/email';

export const generateMockEmails = (): EmailItem[] => {
  return [
    // 1. High Confidence Edge Case (Exactly 0.95 - Auto-Routed)
    {
      id: 'em_auto_1',
      from: 'vendor.services@supplyco.com',
      subject: 'New Vendor Quotation - Steel Pipes Q3',
      textPlain: 'Please find attached our latest quotation for the Q3 steel pipe requisition. All prices are locked for 30 days. Let us know if you have any questions.',
      category: 'vendor_quote',
      confidence: 0.95,
      priority: 'high',
      processedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'classified',
      attachments: [
        { fileName: 'Q3_Quote_Steel_Pipes.pdf', contentType: 'application/pdf', binaryKey: '101' },
        { fileName: 'Specs.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', binaryKey: '102' }
      ]
    },
    // 2. Moderate Confidence Edge Case (Exactly 0.72 - Auto-Routed)
    {
      id: 'em_auto_2',
      from: 'billing@cloudhosting.net',
      subject: 'Invoice #INV-202394 for Cloud Services',
      textPlain: 'Your monthly invoice for cloud infrastructure is attached. Please process payment by the 15th.',
      category: 'invoice_payment',
      confidence: 0.72,
      priority: 'medium',
      processedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'classified',
      attachments: [
        { fileName: 'INV-202394.pdf', contentType: 'application/pdf', binaryKey: '201' }
      ]
    },
    // 3. Just Below Threshold Edge Case (Exactly 0.62 - Manual Review Queue)
    {
      id: 'em_review_1',
      from: 'applicant.jdoe@email.com',
      subject: 'Interest in Engineering Position',
      textPlain: 'To whom it may concern,\n\nI am submitting my resume for the open systems engineering role. I have 5 years of experience but also wanted to ask a general question about your relocation policy.',
      category: 'job_application',
      confidence: 0.62,
      priority: 'medium',
      processedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'unclassified',
      attachments: [
        { fileName: 'J_Doe_Resume.pdf', contentType: 'application/pdf', binaryKey: '301' }
      ]
    },
    // 4. Low Confidence Edge Case (Exactly 0.45 - Manual Review Queue)
    {
      id: 'em_review_2',
      from: 'angry.customer@domain.com',
      subject: 'Project Delivery Feedback and General Questions',
      textPlain: 'The recent project proposal was interesting, but we have complaints about the payment terms. Can someone contact us?',
      category: 'general',
      confidence: 0.45,
      priority: 'high',
      processedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
      status: 'unclassified',
      attachments: []
    },
    // 5. Vendor Inquiry (Auto-Routed)
    {
      id: 'em_auto_3',
      from: 'partner@techbuild.io',
      subject: 'Re: Vendor Inquiry - Delivery timeline',
      textPlain: 'In response to your inquiry, the shipment will arrive by next Tuesday. Attached is the manifest.',
      category: 'vendor_inquiry',
      confidence: 0.85,
      priority: 'medium',
      processedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      status: 'classified',
      attachments: [
        { fileName: 'Shipping_Manifest.pdf', contentType: 'application/pdf', binaryKey: '401' }
      ]
    },
    // 6. Project Proposal (Auto-Routed)
    {
      id: 'em_auto_4',
      from: 'architecture@caldim.engineering',
      subject: 'Q4 Architecture Proposal Draft',
      textPlain: 'Here is the draft for the Q4 system architecture proposal. Please review.',
      category: 'project_proposal',
      confidence: 0.91,
      priority: 'high',
      processedAt: new Date(Date.now() - 1000 * 60 * 350).toISOString(),
      status: 'classified',
      attachments: [
        { fileName: 'Architecture_v1.pdf', contentType: 'application/pdf', binaryKey: '501' },
        { fileName: 'Diagram.png', contentType: 'image/png', binaryKey: '502' }
      ]
    },
    // 7. Junk / Spam (Auto-Routed)
    {
      id: 'em_auto_5',
      from: 'noreply@spam-marketing.com',
      subject: 'Enlarge your server capacity instantly!',
      textPlain: 'Click here to buy cheap servers.',
      category: 'junk',
      confidence: 0.99,
      priority: 'low',
      processedAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
      status: 'classified',
      attachments: []
    },
    // 8. Feedback Complaint (Manual Review / Edge case confidence)
    {
      id: 'em_review_3',
      from: 'client.feedback@corporate.com',
      subject: 'Feedback on the new UI',
      textPlain: 'The new interface is okay, but I think the invoice payment flow is confusing. Also attaching a proposal for changes.',
      category: 'feedback_complaint',
      confidence: 0.55,
      priority: 'low',
      processedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      status: 'unclassified',
      attachments: [
        { fileName: 'UI_Feedback.png', contentType: 'image/png', binaryKey: '601' }
      ]
    }
  ];
};
