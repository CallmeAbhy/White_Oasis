import jsPDF from "jspdf";
import "jspdf-autotable";

// Add this function inside the NearMe component
export const generateBrochure = (home) => {
  const doc = new jsPDF();

  // Title with Logo
  doc.setFontSize(22);
  doc.setTextColor(40, 116, 166);
  doc.setFont("helvetica", "bold");
  doc.text(home.old_age_home_name, 20, 20);

  if (home.manager_id.trust_logo) {
    doc.addImage(home.manager_id.trust_logo, "JPEG", 160, 15, 30, 30); // Adjusted Trust Logo
  }

  // Basic Information Section
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  doc.text("Basic Information", 20, 50);

  const basicInfo = [
    [
      "Location",
      `${home.old_age_home_city}, ${home.old_age_home_state}, ${home.old_age_home_country}`,
    ],
    ["Address", home.old_age_home_address],
    [
      "Rating",
      `${home.avg_rating.toFixed(1)} ⭐ (${home.num_review.length} reviews)`,
    ],
    ["Operating Hours", `${home.opens_on} - ${home.closes_on}`],
    ["Working Days", home.working_days.join(", ")],
  ];

  doc.autoTable({
    startY: 55,
    headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [50, 50, 50] },
    head: [["Field", "Details"]],
    body: basicInfo,
    theme: "striped",
  });

  // Contact Information Section
  doc.text("Contact Information", 20, doc.lastAutoTable.finalY + 15);
  const contactInfo = [
    ["Phone Numbers", home.contact_numbers.join(", ")],
    ["Email", home.email],
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [50, 50, 50] },
    head: [["Contact Type", "Details"]],
    body: contactInfo,
    theme: "striped",
  });

  // Facilities Section
  if (home.facilities?.length) {
    doc.text("Facilities", 20, doc.lastAutoTable.finalY + 15);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      headStyles: { fillColor: [40, 166, 72], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [50, 50, 50] },
      head: [["Available Facilities"]],
      body: home.facilities.map((facility) => [facility]),
      theme: "striped",
    });
  }

  // Services Section
  if (home.services?.length) {
    doc.text("Services", 20, doc.lastAutoTable.finalY + 15);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      headStyles: { fillColor: [72, 103, 166], textColor: [255, 255, 255] },
      bodyStyles: { textColor: [50, 50, 50] },
      head: [["Available Services"]],
      body: home.services.map((service) => [service]),
      theme: "striped",
    });
  }

  // Staff Information Section
  doc.text("Staff Information", 20, doc.lastAutoTable.finalY + 15);
  const staffInfo = [
    ["Medical Staff", home.staff_info?.medical_staff || 0],
    ["Care Workers", home.staff_info?.care_workers || 0],
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    headStyles: { fillColor: [230, 126, 34], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [50, 50, 50] },
    head: [["Staff Type", "Count"]],
    body: staffInfo,
    theme: "striped",
  });

  // Fee Structure Section
  doc.text("Fee Structure", 20, doc.lastAutoTable.finalY + 15);
  const feeInfo = [
    ["Monthly Fee", `₹${home.fee_structure?.monthly || 0}`],
    ["Yearly Fee", `₹${home.fee_structure?.yearly || 0}`],
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    headStyles: { fillColor: [40, 116, 166], textColor: [255, 255, 255] },
    bodyStyles: { textColor: [50, 50, 50] },
    head: [["Duration", "Amount"]],
    body: feeInfo,
    theme: "striped",
  });

  // Add Footer with Page Numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      {
        align: "center",
      }
    );
  }

  // Save the PDF
  doc.save(`${home.old_age_home_name}_brochure.pdf`);
};
