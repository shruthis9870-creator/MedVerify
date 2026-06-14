import {
  Bell,
  Search,
  UserCircle2,
  ChevronRight,
  Menu,
  ArrowLeft,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import Timeline from "../dashboard/Timeline";
import { useLiveAlerts } from "../../hooks/useLiveAlerts";
import { useAuth } from "../../context/AuthContext";
import { displaySpecialty, displayUserName } from "../../utils/profile";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { alerts } = useLiveAlerts(7000);
  const { user } = useAuth();

  const notificationsRef = useRef(null);

  const unreadCount = alerts.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showNotifications) return;

    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showNotifications]);

  const getPageLabel = (pathname) => {
    const paths = {
      "/dashboard": "Dashboard",
      "/active-cases": "Active Cases",
      "/alerts": "High Risk Alerts",
      "/patients": "Patients",
      "/decision-panel": "Decision Panel",
      "/profile": "Profile",
      "/notifications": "Notifications",
      "/settings": "Settings",
      "/help": "Help",
      "/emergency": "Emergency",
      "/support": "Support",
    };

    return paths[pathname] || "Dashboard";
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmed = searchTerm.trim();

    if (!trimmed) return;

    navigate("/patients", {
      state: { searchTerm: trimmed },
    });

    setSearchTerm("");
  };

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-[32px]
        bg-white
        px-6
        py-5
        shadow-sm
        ring-1
        ring-slate-200
        mb-8
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 flex-1">

        {/* HAMBURGER */}
        <button
          onClick={onMenuClick}
          className="
            rounded-2xl
            bg-slate-100
            p-3
            hover:bg-slate-200
            transition
          "
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </button>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
            rounded-2xl
            bg-slate-100
            p-3
            hover:bg-slate-200
            transition
          "
        >
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </button>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="
            hidden md:flex
            items-center
            gap-2
            rounded-3xl
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
            max-w-md
            w-full
          "
        >
          <Search className="h-4 w-4 text-slate-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search patients"
            className="
              w-full
              bg-transparent
              outline-none
              text-slate-700
              placeholder:text-slate-400
            "
          />
        </form>

        {/* BREADCRUMB */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <span className="text-slate-500">
            Dashboard
          </span>

          <ChevronRight
            size={16}
            className="text-slate-400"
          />

          <span className="font-semibold text-slate-900">
            {getPageLabel(location.pathname)}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 relative">

        {/* TIME */}
        <div className="hidden xl:block text-xs text-slate-500">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}

          {" • "}

          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* NOTIFICATIONS */}
        <button
          onClick={() =>
            setShowNotifications((v) => !v)
          }
          className="
            relative
            rounded-2xl
            bg-slate-100
            p-3
            hover:bg-slate-200
            transition
          "
        >
          <Bell className="h-5 w-5 text-slate-700" />

          {unreadCount > 0 && (
            <span
              className="
                absolute
                -top-1
                -right-1
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-red-500
                text-xs
                font-bold
                text-white
              "
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* PROFILE */}
        <button
          onClick={() => navigate("/profile")}
          className="
            hidden md:flex
            items-center
            gap-3
            rounded-3xl
            bg-slate-100
            px-4
            py-2
            hover:bg-slate-200
            transition
          "
        >
          <UserCircle2 className="h-7 w-7 text-slate-700" />

          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">
              {displayUserName(user)}
            </p>

            <p className="text-xs text-slate-500">
              {displaySpecialty(user)}
            </p>
          </div>
        </button>

        {/* NOTIFICATION DROPDOWN */}
        {showNotifications && (
          <div
            ref={notificationsRef}
            className="
              absolute
              right-0
              top-16
              z-50
              w-[420px]
              max-w-[90vw]
            "
          >
            <div
              className="
                rounded-[32px]
                bg-white
                shadow-2xl
                ring-1
                ring-slate-200
              "
            >
              <div className="border-b border-slate-100 px-6 py-4">
                <p className="text-lg font-semibold text-slate-900">
                  Notifications
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {unreadCount} unread updates
                </p>
              </div>

              <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
                <Timeline
                  compact
                  showHeader={false}
                  maxItems={6}
                />
              </div>

              <div className="border-t border-slate-100 p-4">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/notifications");
                  }}
                  className="
                    w-full
                    rounded-3xl
                    bg-slate-950
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-slate-800
                    transition
                  "
                >
                  Open Notifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
