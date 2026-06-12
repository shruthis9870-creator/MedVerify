import {
  Bell,
  CalendarDays,
  FileText,
  Brain,
  CheckCircle,
} from "lucide-react";

export default function PatientNotifications() {
  const notifications = [
    {
      icon: <CalendarDays className="text-cyan-400" />,
      title: "Appointment Reminder",
      message: "Cardiology appointment on 2 June 2026 at 10:30 AM",
      time: "2 hours ago",
    },

    {
      icon: <Brain className="text-purple-400" />,
      title: "AI Analysis Completed",
      message: "Your ECG report has been analyzed successfully",
      time: "Today",
    },

    {
      icon: <FileText className="text-yellow-400" />,
      title: "New Report Uploaded",
      message: "Blood Test Report uploaded successfully",
      time: "Yesterday",
    },

    {
      icon: <CheckCircle className="text-green-400" />,
      title: "Doctor Review Complete",
      message: "Dr. Sharma reviewed your latest report",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#071133] to-[#0F172A] text-white p-10">

      <div className="flex items-center gap-4 mb-10">

        <Bell
          size={50}
          className="text-cyan-400"
        />

        <div>
          <h1 className="text-5xl font-bold">
            Notifications
          </h1>

          <p className="text-slate-400">
            Recent updates from MediAssist
          </p>
        </div>

      </div>

      <div className="space-y-6">

        {notifications.map((notification, index) => (

          <div
            key={index}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex justify-between items-center"
          >

            <div className="flex items-center gap-5">

              <div className="bg-slate-900 p-4 rounded-2xl">
                {notification.icon}
              </div>

              <div>

                <h3 className="font-bold text-xl">
                  {notification.title}
                </h3>

                <p className="text-slate-400">
                  {notification.message}
                </p>

              </div>

            </div>

            <span className="text-slate-500 text-sm">
              {notification.time}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}