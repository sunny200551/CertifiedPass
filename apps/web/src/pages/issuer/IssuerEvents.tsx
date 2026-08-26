import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Plus, ExternalLink, Award, Users } from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";

export default function IssuerEvents() {
  const [events, setEvents] = useState([
    {
      id: "ethsf-2026",
      name: "ETHSF Innovation Summit 2026",
      eventType: "hackathon",
      date: "2026-08-20",
      location: "San Francisco, CA & Online",
      credentialsCount: 42,
    },
    {
      id: "polygon-accelerator",
      name: "Polygon Amoy Developer Accelerator",
      eventType: "workshop",
      date: "2026-06-10",
      location: "Virtual",
      credentialsCount: 88,
    },
    {
      id: "zk-internship-summer",
      name: "ZK Summer Engineering Cohort",
      eventType: "internship",
      date: "2026-07-31",
      location: "Remote",
      credentialsCount: 12,
    },
  ]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-8 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Events & Programs</h1>
            <p className="text-sm text-slate-400 mt-1">Organize hackathons, internship cohorts, and certification events.</p>
          </div>

          <Link to="/issuer/issue">
            <Button variant="primary" className="gap-1.5">
              <Plus className="h-4 w-4" /> Issue for Event
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-purple-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={ev.eventType as any} size="sm">
                    {ev.eventType.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{ev.date}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{ev.name}</h3>
                <p className="text-xs text-slate-400">{ev.location}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" /> {ev.credentialsCount} Issued
                </span>
                <Link to={`/issuer/events/${ev.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    Manage <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
