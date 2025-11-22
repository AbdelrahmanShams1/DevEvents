"use client";

import { IEvent } from "@/database";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Edit2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function EventsTable({ events }: { events: IEvent[] }) {
  const { data } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      return res.json().then((data) => data.events);
    },
    initialData: events,
    staleTime: 1000,
  });

  const onDelete = async (id: string) => {
    console.log("Deleting event with id:", id);
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.status === 200) {
      console.log("Event deleted successfully");
    }
  };

  if (!data) return "Loading...";
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Events</h2>
          <p className="text-slate-400 text-sm">{events.length} total events</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <span>+ Add Event</span>
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-t-xl border border-slate-700/50">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-slate-300">
          <div className="col-span-3">Event</div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
            Location <ChevronDown className="w-4 h-4" />
          </div>
          <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
            Date <ChevronDown className="w-4 h-4" />
          </div>
          <div className="col-span-2">Bookings</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-b-xl border-x border-b border-slate-700/50 divide-y divide-slate-700/30">
        {data.map((event: IEvent, index: number) => {
          return (
            <div
              key={event.id}
              className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-800/40 transition-all duration-200 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Event Name & Image */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-slate-700/50 group-hover:ring-emerald-500/50 transition-all">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {event.mode === "upcoming" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                  )}
                </div>
                <div>
                  <div className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                    {event.title}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="col-span-2 flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm">{event.location}</span>
              </div>

              {/* Date & Time */}
              <div className="col-span-2 flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {event.time}
                </div>
              </div>

              {/* Bookings Progress */}
              <div className="col-span-2 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-white font-medium">{event.booked}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"></div>
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center">
                <span className="text-white font-medium">{event.mode}</span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-2">
                <Link
                  href={`/dashboard/edit/${event.slug}`}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group/btn"
                  aria-label="Edit event"
                >
                  <Edit2 className="w-4 h-4 text-slate-400 group-hover/btn:text-emerald-400 transition-colors" />
                </Link>
                <button
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors group/btn"
                  aria-label="Delete event"
                  onClick={() => onDelete(event?._id as string)}
                >
                  <Trash2 className="w-4 h-4 text-slate-400 group-hover/btn:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (shown when no events) */}
      {events.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No events found</p>
        </div>
      )}
    </div>
  );
}
