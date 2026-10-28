"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  BookOpen, 
  HeartHandshake, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Volume2,
  AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"moderation" | "cms" | "the-well">("moderation");

  // Mock moderation items
  const [pendingValleyPosts, setPendingValleyPosts] = useState([
    {
      id: "v-1",
      user: "Seeker_719",
      room: "Navigating Grief in the Psalms",
      fixedPhrase: "Praying for comfort in the silence",
      reflection: "Lost my grandfather this past Monday. Remembering that the Lord is near to the brokenhearted.",
      submittedAt: "18m ago"
    },
    {
      id: "v-2",
      user: "JordanM",
      room: "Faith in the Corporate Workplace",
      fixedPhrase: "Seeking wisdom for difficult meetings",
      reflection: "Facing layoffs at my company tomorrow. Praying for peace and ethical clarity.",
      submittedAt: "42m ago"
    }
  ]);

  // Mock Pastoral Care Requests (The Well)
  const [pastoralRequests, setPastoralRequests] = useState([
    {
      id: "p-101",
      seeker: "Sarah (Overwhelmed Seeker)",
      status: "received",
      timeRemaining: "1h 48m",
      request: "I feel crippled by anxiety regarding my marriage and work fatigue. I need a word of prayer and scripture to hold onto tonight.",
      submittedAt: "2h 12m ago"
    },
    {
      id: "p-102",
      seeker: "Marcus T.",
      status: "received",
      timeRemaining: "3h 15m",
      request: "Struggling with recurring temptation and feeling distant from God. Could a pastor please respond with an audio prayer?",
      submittedAt: "45m ago"
    }
  ]);

  const handleApprove = (id: string) => {
    setPendingValleyPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingValleyPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* KPI Banners */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF6F0] border border-[#D9CFC4] p-5 rounded-xl shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#2E2A24]/60 font-semibold">North Star Metric</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#2E2A24]">71.4%</span>
            <span className="text-xs text-emerald-700 font-medium">↑ +4.2%</span>
          </div>
          <p className="text-xs text-[#2E2A24]/70 mt-1">Day 4 Journey Completion Rate</p>
        </div>

        <div className="bg-[#FAF6F0] border border-[#D9CFC4] p-5 rounded-xl shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#2E2A24]/60 font-semibold">Moderation Queue</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#E8A98C]">{pendingValleyPosts.length}</span>
            <span className="text-xs text-[#2E2A24]/60 font-medium">pending review</span>
          </div>
          <p className="text-xs text-[#2E2A24]/70 mt-1">Avg review time: 14 mins</p>
        </div>

        <div className="bg-[#FAF6F0] border border-[#D9CFC4] p-5 rounded-xl shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#2E2A24]/60 font-semibold">The Well SLA</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-700">100%</span>
            <span className="text-xs text-emerald-700 font-medium">Within 4h</span>
          </div>
          <p className="text-xs text-[#2E2A24]/70 mt-1">{pastoralRequests.length} active requests awaiting response</p>
        </div>

        <div className="bg-[#FAF6F0] border border-[#D9CFC4] p-5 rounded-xl shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#2E2A24]/60 font-semibold">Active Weekly Cycle</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-[#2E2A24]">Week 1</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Live</span>
          </div>
          <p className="text-xs text-[#2E2A24]/70 mt-1">John 15:5 (ESV)</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D9CFC4] gap-6">
        <button
          onClick={() => setActiveTab("moderation")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "moderation"
              ? "border-[#E8A98C] text-[#2E2A24]"
              : "border-transparent text-[#2E2A24]/50 hover:text-[#2E2A24]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Moderation Queue ({pendingValleyPosts.length})
        </button>

        <button
          onClick={() => setActiveTab("the-well")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "the-well"
              ? "border-[#E8A98C] text-[#2E2A24]"
              : "border-transparent text-[#2E2A24]/50 hover:text-[#2E2A24]"
          }`}
        >
          <HeartHandshake className="w-4 h-4" /> The Well: Pastoral Care ({pastoralRequests.length})
        </button>

        <button
          onClick={() => setActiveTab("cms")}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "cms"
              ? "border-[#E8A98C] text-[#2E2A24]"
              : "border-transparent text-[#2E2A24]/50 hover:text-[#2E2A24]"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Scripture CMS & Drops
        </button>
      </div>

      {/* Section Content */}
      {activeTab === "moderation" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">In The Valley — User Reflections Awaiting Approval</h2>
            <span className="text-xs text-[#2E2A24]/60">Zero unmoderated text goes live to public boards</span>
          </div>

          {pendingValleyPosts.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF6F0] rounded-xl border border-[#D9CFC4] text-sm text-[#2E2A24]/60">
              ✓ All moderation queues are clear.
            </div>
          ) : (
            pendingValleyPosts.map((post) => (
              <div key={post.id} className="p-5 bg-[#FAF6F0] border border-[#D9CFC4] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs text-[#2E2A24]/70">
                    <span className="font-semibold text-[#2E2A24]">{post.user}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#3D5A5B]/15 text-[#3D5A5B] font-medium">{post.room}</span>
                    <span>•</span>
                    <span>{post.submittedAt}</span>
                  </div>
                  <p className="font-serif italic text-sm font-semibold text-[#2E2A24]">
                    "{post.fixedPhrase}"
                  </p>
                  <p className="text-sm text-[#2E2A24]/85 leading-relaxed">
                    {post.reflection}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleReject(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold transition"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(post.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E8A98C] text-white hover:bg-[#d8987b] text-xs font-semibold shadow-sm transition"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve to Board
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "the-well" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">The Well — Private Pastoral Care Desk</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> 4-Hour Response Guarantee SLA Active
            </div>
          </div>

          {pastoralRequests.map((req) => (
            <div key={req.id} className="p-6 bg-[#FAF6F0] border border-[#D9CFC4] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#2E2A24]">{req.seeker}</h3>
                  <span className="text-xs text-[#2E2A24]/60">Received {req.submittedAt}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-1 rounded-md">
                    SLA Deadline: {req.timeRemaining} remaining
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/70 border border-[#D9CFC4]/50 rounded-lg text-sm text-[#2E2A24] leading-relaxed">
                "{req.request}"
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2E2A24] text-white text-xs font-semibold hover:bg-black transition">
                  Write Pastoral Response
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#D9CFC4] bg-white text-[#2E2A24] text-xs font-semibold hover:bg-[#FAF6F0] transition">
                  <Volume2 className="w-4 h-4 text-[#E8A98C]" /> Record 60s Voice Blessing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "cms" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Scripture Schedule & Context Management</h2>
            <button className="px-4 py-2 rounded-lg bg-[#E8A98C] text-white text-xs font-semibold shadow-sm hover:bg-[#d8987b] transition">
              + Schedule Next Week Drop
            </button>
          </div>

          <div className="p-6 bg-[#FAF6F0] border border-[#D9CFC4] rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9CFC4] pb-4">
              <div>
                <span className="text-xs font-bold text-[#E8A98C] uppercase tracking-wider">Current Cycle</span>
                <h3 className="text-base font-bold text-[#2E2A24]">Week 1: John 15:5 (ESV)</h3>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Active Worldwide
              </span>
            </div>

            <p className="font-serif italic text-base text-[#2E2A24] p-4 bg-white/80 rounded-lg border border-[#D9CFC4]/60">
              "I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit, for apart from me you can do nothing."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white/60 border border-[#D9CFC4]/60 rounded-lg text-xs">
                <p className="font-bold text-[#2E2A24]">Day 1 Video Asset</p>
                <p className="text-[#2E2A24]/70 mt-1">week1_encounter_hd.mp4 (4K H.265)</p>
              </div>
              <div className="p-3 bg-white/60 border border-[#D9CFC4]/60 rounded-lg text-xs">
                <p className="font-bold text-[#2E2A24]">Day 2 Context Cards</p>
                <p className="text-[#2E2A24]/70 mt-1">3 Historical & Exegetical Cards</p>
              </div>
              <div className="p-3 bg-white/60 border border-[#D9CFC4]/60 rounded-lg text-xs">
                <p className="font-bold text-[#2E2A24]">Day 3 Ambient Sound</p>
                <p className="text-[#2E2A24]/70 mt-1">Preset: Sanctuary Dawn (432Hz)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
