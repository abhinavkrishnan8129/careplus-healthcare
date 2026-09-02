export const sendSMSNotificationFast2SMS = async (
  phone: string,
  message: string
) => {
  try {
    console.log("Fast2SMS Debug: Original Phone:", phone);

    // Fast2SMS expects a 10-digit number without the country code
    const formattedPhone = phone.startsWith("+91") ? phone.slice(3) : phone;
    console.log("Fast2SMS Debug: Formatted Phone:", formattedPhone);

    const apiKey = process.env.FAST2SMS_API_KEY;
    const isDemoMode = process.env.DEMO_SMS === "true" || !apiKey;

    if (isDemoMode) {
      // ----------------------------------------------------
      // DEMO MODE: Academic simulation bypassing API restrictions
      // ----------------------------------------------------
      console.log(`\n================= SMS DEMO MODE =================`);
      console.log(`SMS SENT (DEMO): "${message}" to ${formattedPhone}`);
      console.log(`=================================================\n`);
      return { return: true, demo: true, message: "Demo SMS sent successfully" };
    }

    console.log("Fast2SMS Debug: API Key is loaded. Sending real SMS...");

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: formattedPhone,
      }),
    });

    const data = await response.json();
    console.log("Fast2SMS Debug: Full API Response:", JSON.stringify(data));

    if (!response.ok || !data.return) {
      console.error("Fast2SMS API Error Response:", data);
    } else {
      console.log("SMS sent successfully via Fast2SMS:", data);
    }

    return data;
  } catch (error) {
    console.error("Failed to send SMS via Fast2SMS:", error);
  }
};
