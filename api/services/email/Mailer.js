const sendgrid = require("sendgrid");
const helper = sendgrid.mail;

class Mailer extends helper.Mail {
  constructor({ subject, email }, content) {
    super();

    this.sgApi = sendgrid(process.env.SEND_GRID_KEY);
    this.from_email = new helper.Email("no-reply@getmidas.co");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipient = new helper.Email(email);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipient();
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);
    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipient() {
    const personalize = new helper.Personalization();
    personalize.addTo(this.recipient);
    this.addPersonalization(personalize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: this.toJSON(),
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
