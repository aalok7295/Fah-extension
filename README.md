# 😭 Job Rejection Alarm

> *Because sometimes you need to fully feel it.*

A Chrome browser extension that plays a dramatic **"FAAAAHHHHH"** sound every time it detects a job rejection email in your inbox. Catharsis as a service.

---

## 🎯 What It Does

- 👀 **Monitors** your inbox in real-time for rejection language
- 🔊 **Plays a procedurally generated** "FAAAAHHHHH" cry of despair (no audio files — it synthesizes the sound of your broken dreams using the Web Audio API)
- 🔔 **Shows a toast notification** with an encouraging message and your running rejection tally
- 📊 **Tracks** how many rejections you've collected (wear them as a badge of honor)
- 🧪 **Test button** in the popup so you can feel the pain on demand

---

## 📬 Supported Email Clients

| Email Client | Status |
|---|---|
| Gmail | ✅ Supported |
| Outlook (Live / Office / 365) | ✅ Supported |
| Yahoo Mail | ✅ Supported |

---

## 🚀 Installation

This extension isn't on the Chrome Web Store (yet), so you'll need to load it manually. It takes about 60 seconds.

1. **Download** this repository — click the green **Code** button → **Download ZIP**
2. **Unzip** the downloaded file
3. Open Chrome and navigate to `chrome://extensions`
4. Enable **Developer Mode** using the toggle in the top-right corner
5. Click **"Load unpacked"**
6. Select the unzipped folder
7. Done. Open your inbox and await your fate. 🎲

---

## 🔍 How Rejection Detection Works

The extension scans email body text for rejection phrases such as:

- *"we regret to inform"*
- *"we have decided to move forward with other candidates"*
- *"not the right fit"*
- *"we are unable to offer"*
- *"unfortunately"* (combined with job context)
- ...and ~20 more classic HR deflections

To avoid false positives, it also checks for **job-related context words** (application, position, role, interview, candidate, etc.) before triggering. Your newsletter about "unfortunately priced airline tickets" is safe.

---

## 🔒 Privacy

- **No data is collected.** Ever.
- **No external servers.** The extension runs entirely in your browser.
- **No audio files.** The "FAAAAHHHHH" is synthesized live using the Web Audio API — your rejection is generated fresh, just for you.
- The only permission it uses beyond reading the page is `storage` — to remember your rejection count locally on your own machine.

---

## 🛠️ Tech Stack

- Vanilla JavaScript (no frameworks, no dependencies)
- Web Audio API for procedural sound synthesis
- Chrome Extensions Manifest V3
- MutationObserver for real-time email detection
- Pure, unadulterated suffering

---

## 🤝 Contributing

PRs welcome! Some ideas:

- [ ] Support for more email clients (ProtonMail, Fastmail, etc.)
- [ ] Customizable sound / volume
- [ ] More rejection phrase patterns
- [ ] A "Wins" counter for offer letters 🎉
- [ ] Export rejection stats to CSV (for the truly unwell)
- [ ] Firefox support

---

## 📜 License

MIT — do whatever you want with it. You've earned it.

---

<div align="center">
  <i>Built with love, rejection, and a concerning familiarity with HR email templates.</i><br><br>
  ⭐ Star this repo if you've ever gotten a rejection email. You know who you are.
</div>
