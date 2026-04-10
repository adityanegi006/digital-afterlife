import jsPDF from 'jspdf';

export function generateClaimMemo(type: 'Asset' | 'Insurance', item: any) {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(59, 130, 246);
  doc.text('Notice of Death & Asset Claim Request', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated securely by Digital Afterlife Manager on ${date}`, 105, 28, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Body
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('To Whom It May Concern:', 20, 50);

  doc.setFontSize(12);
  const bodyText = `This document serves as an official request by the designated beneficiary to claim the following ${type.toLowerCase()} belonging to the deceased account holder. Please review the details below to initiate the required transfer protocol in accordance with legal directives.`;
  
  const splitText = doc.splitTextToSize(bodyText, 170);
  doc.text(splitText, 20, 60);

  // Details Section Backdrop
  doc.setFillColor(240, 245, 255);
  doc.rect(20, 85, 170, 70, 'F');
  
  doc.setFontSize(14);
  doc.text(`${type} Details:`, 25, 95);
  
  doc.setFontSize(12);
  if (type === 'Asset') {
    doc.text(`Asset Type: ${item.type}`, 25, 110);
    doc.text(`Beneficiary: ${item.beneficiary}`, 25, 120);
    doc.text(`Account / Description:`, 25, 130);
    
    doc.setFontSize(10);
    const detailsWrap = doc.splitTextToSize(item.details, 160);
    doc.text(detailsWrap, 25, 140);
  } else {
    // Insurance
    doc.text(`Insurance Type: ${item.type} Insurance`, 25, 110);
    doc.text(`Provider / Company: ${item.provider}`, 25, 120);
    doc.text(`Policy Number: ${item.policyNumber}`, 25, 130);
    doc.text(`Designated Beneficiary: ${item.beneficiary}`, 25, 140);
  }

  // Footer / Signatures
  doc.setFontSize(12);
  doc.text('Mandatory Attachments to Accompany this Form:', 20, 180);
  doc.setFontSize(10);
  doc.text('[ ] Certified Copy of Death Certificate', 20, 190);
  doc.text('[ ] Legal Proof of Identity for Beneficiary', 20, 198);
  if(item.fileUrl) {
    doc.text('[ ] System-Generated Copy of Policy / Deed', 20, 206);
  }

  doc.setLineWidth(0.5);
  doc.line(120, 240, 180, 240);
  doc.text('Signature of Beneficiary', 125, 245);

  doc.save(`${type}_Claim_Memo_${item.id.substring(0, 5)}.pdf`);
}
