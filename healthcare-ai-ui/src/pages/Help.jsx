import { useState } from "react";
import PageShell from "../components/layout/PageShell";

const faqItems = [
  {
    question: "How do I escalate a critical case?",
    answer: "Use the Emergency support line or open the alert detail to review the AI recommendation and route the patient immediately.",
  },
  {
    question: "Why am I seeing duplicate report uploads?",
    answer: "Duplicate uploads can happen when a file is re-added from multiple devices. Check the report backlog and confirm the latest version before reviewing.",
  },
  {
    question: "How can I reset my dashboard preferences?",
    answer: "Go to Settings and restore your notification and theme defaults, then save the updated preferences from the dashboard footer.",
  },
  {
    question: "How do I request a specialist consult?",
    answer: "Open the patient profile, review the AI recommendation, and use the request tests or escalation workflow to send the consult note.",
  },
  {
    question: "Where do I find recent support tickets?",
    answer: "Ticket history is reflected in the support summary cards and can be reviewed on the support center landing page.",
  },
];

export default function Help() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [supportForm, setSupportForm] = useState({
    name: "",
    issueType: "System access",
    description: "",
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTicketSubmitted(true);
    setSupportForm({ name: "", issueType: "System access", description: "" });
  };

  return (
    <PageShell
      title="Need assistance?"
      subtitle="Our support team is available around the clock to help with patient workflows, system access, and urgent cases."
      status="Help & support"
      footer={
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Contact support</p>
            <p className="mt-3 text-sm text-slate-600">Reach out for urgent platform issues or case escalations.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Self-service</p>
            <p className="mt-3 text-sm text-slate-600">Browse documentation and workflow guides in the help center.</p>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">System uptime</p>
            <p className="mt-3 text-sm text-slate-600">Monitoring is active 24/7 to ensure uninterrupted access.</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Emergency support</h2>
          <p className="mt-4 text-sm text-slate-600">📞 +91 98765 43210</p>
          <p className="mt-2 text-sm text-slate-500">For immediate critical assistance.</p>
        </div>
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Email support</h2>
          <p className="mt-4 text-sm text-slate-600">📧 support@mediassist.com</p>
          <p className="mt-2 text-sm text-slate-500">Send questions or incident reports anytime.</p>
        </div>
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Service availability</h2>
          <p className="mt-4 text-sm text-slate-600">🏥 24/7 technical assistance</p>
          <p className="mt-2 text-sm text-slate-500">Continuous monitoring and fast response.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">FAQ</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Common support questions</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{faqItems.length} items</span>
          </div>

          <div className="mt-6 space-y-3">
            {faqItems.map((item, index) => (
              <div key={item.question} className="rounded-3xl border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-slate-900">{item.question}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {openFaqIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="border-t border-slate-200 px-4 py-4 text-sm text-slate-600">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Support ticket</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Submit a support ticket</h2>
            <p className="mt-2 text-sm text-slate-500">Describe the issue and our team will respond with the next best step.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Name</label>
              <input
                type="text"
                value={supportForm.name}
                onChange={(event) => setSupportForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Issue Type</label>
              <select
                value={supportForm.issueType}
                onChange={(event) => setSupportForm((current) => ({ ...current, issueType: event.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option>System access</option>
                <option>Patient record issue</option>
                <option>Report upload problem</option>
                <option>Urgent escalation</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Description</label>
              <textarea
                value={supportForm.description}
                onChange={(event) => setSupportForm((current) => ({ ...current, description: event.target.value }))}
                rows={6}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Describe the issue in detail"
                required
              />
            </div>

            <button
              type="submit"
              className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Submit Support Ticket
            </button>

            {ticketSubmitted && (
              <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Ticket submitted successfully. Our support team will review it shortly.
              </div>
            )}
          </form>
        </section>
      </div>
    </PageShell>
  );
}