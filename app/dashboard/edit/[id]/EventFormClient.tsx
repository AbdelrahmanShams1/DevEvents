"use client";

import { useState } from "react";
import { IEvent } from "@/database/event.model";
import { addEvent, updateEventById } from "@/lib/actions/event.actions";
import { Formik } from "formik";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  Tag,
  Users,
  Building,
  Globe,
  Plus,
  X,
} from "lucide-react";

type Errors = {
  title?: string;
  description?: string;
  overview?: string;
  image?: string;
  venue?: string;
  location?: string;
  date?: string;
  time?: string;
  mode?: string;
  audience?: string;
  organizer?: string;
  tags?: string;
};

interface EventFormClientProps {
  event: IEvent;
}

const EventFormClient = ({ event }: EventFormClientProps) => {
  const [agendaItems, setAgendaItems] = useState<string[]>(
    event.agenda && event.agenda.length > 0 ? event.agenda : [""]
  );

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const updateAgendaItem = (index: number, value: string) => {
    const newItems = [...agendaItems];
    newItems[index] = value;
    setAgendaItems(newItems);
  };

  return (
    <Formik
      initialValues={{
        title: event.title || "",
        description: event.description || "",
        overview: event.overview || "",
        image: event.image || "",
        venue: event.venue || "",
        location: event.location || "",
        date: event.date || "",
        time: event.time || "",
        mode: event.mode || "",
        audience: event.audience || "",
        organizer: event.organizer || "",
        tags: event.tags?.join(", ") || "",
      }}
      validate={(values) => {
        const errors: Errors = {};
        if (!values.title) {
          errors.title = "Event title is required";
        }
        if (!values.date) {
          errors.date = "Event date is required";
        }
        if (!values.description) {
          errors.description = "Description is required";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          const formData = {
            ...values,
            agenda: agendaItems.filter((item) => item.trim() !== ""),
            tags: values.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          };
          const res = await updateEventById(event._id as string, formData);
          if (res?.success) {
            alert("Event updated successfully!");
          } else {
            alert(res?.error);
          }
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Cloud Next 2026"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
            {errors.title && touched.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the event"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              rows={2}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
            />
            {errors.description && touched.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Overview
            </label>
            <textarea
              name="overview"
              placeholder="Detailed overview of what attendees can expect"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.overview}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Image URL
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.image}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Venue and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Venue
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g., Moscone Center"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.venue}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., San Francisco, CA"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Event Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
              {errors.date && touched.date && (
                <p className="text-red-400 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="time"
                  name="time"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.time}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Event Mode
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                name="mode"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.mode}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition appearance-none cursor-pointer"
              >
                <option value="">Select event mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Audience
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="audience"
                placeholder="e.g., Cloud engineers, DevOps, enterprise leaders"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.audience}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Agenda */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Event Agenda
              </label>
              <button
                type="button"
                onClick={addAgendaItem}
                className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm transition"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
            <div className="space-y-2">
              {agendaItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., 08:30 AM - 09:30 AM | Keynote: AI-Driven Cloud"
                    value={item}
                    onChange={(e) => updateAgendaItem(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  />
                  {agendaItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Organizer Information
            </label>
            <textarea
              name="organizer"
              placeholder="Information about the event organizer"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.organizer}
              rows={2}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="tags"
                placeholder="Cloud, DevOps, Kubernetes, AI (comma-separated)"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.tags}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
          >
            {isSubmitting ? "Saving..." : "Save Event"}
          </button>
        </div>
      )}
    </Formik>
  );
};

export default EventFormClient;
