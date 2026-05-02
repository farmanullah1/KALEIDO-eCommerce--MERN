const sendEmail = async ({ to, subject, template, data }) => {
  console.log(`[EMAIL SERVICE] Sending "${subject}" to ${to}`);
  console.log(`[TEMPLATE] ${template}`);
  console.log(`[DATA]`, data);
  
  // Simulation of async network call
  return new Promise(resolve => setTimeout(resolve, 500));
};

module.exports = {
  sendVerificationEmail: (email, code, crystalColor) => 
    sendEmail({
      to: email,
      subject: "KALEIDO — Seal your anchor",
      template: "verification",
      data: { code, crystalColor, text: "This code expires in one hour. Enter it to complete your anchoring ritual." }
    }),
    
  sendPasswordResetEmail: (email, token) =>
    sendEmail({
      to: email,
      subject: "KALEIDO — Reseal your vault",
      template: "password_reset",
      data: { token, link: `http://localhost:5175/reset-password/${token}`, text: "Click the forge below to create a new key. This link crumbles in one hour." }
    }),
    
  sendWelcomeEmail: (email, crystalColor) =>
    sendEmail({
      to: email,
      subject: "KALEIDO — Your anchor is set",
      template: "welcome",
      data: { crystalColor, text: "The bazaar awaits. Your echoes start here." }
    })
};
