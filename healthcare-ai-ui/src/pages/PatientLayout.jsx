import { useState } from "react";

import { Outlet } from "react-router-dom";

import PatientSidebar from "../components/patient/PatientSidebar";
import PatientTopbar from "../components/patient/PatientTopbar";

export default function PatientLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <PatientSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: collapsed ? "6rem" : "18rem",
        }}
      >
        <PatientTopbar
          onMenuClick={() => setCollapsed(!collapsed)}
        />

        <div className="p-8">
          <Outlet />
        </div>
      </div>

    </div>
  );
}