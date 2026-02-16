module.exports = {
  stylesheet: ["assets/css/cv-pdf.css"],
  pdf_options: {
    format: "A4",
    margin: {
      top: "16mm",
      right: "14mm",
      bottom: "16mm",
      left: "14mm"
    },
    printBackground: true
  },
  launch_options: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
};
