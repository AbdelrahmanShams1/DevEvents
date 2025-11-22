import { IEvent } from "@/database/event.model";
import EventFormClient from "./EventFormClient";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface EditPageProps {
  // In Next 16 app router, params is provided as a Promise
  params: Promise<{ id: string }>;
}

const URL = process.env.NEXT_PUBLIC_BASE_URL;

async function getEvent(slug: string): Promise<IEvent> {
  console.log("Fetching event data for slug:", slug);
  const res = await fetch(`${URL}/api/events/${slug}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch event data");
  }

  const data = await res.json();
  return data.event as IEvent;
}

// Server component that performs the uncached fetch
const EventFormServer = async ({ slug }: { slug: string }) => {
  const event = await getEvent(slug);
  return <EventFormClient event={event} />;
};

// Page component unwraps params (Promise) and wraps the async part in Suspense
const EditEventPage = async ({ params }: EditPageProps) => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  // Our dynamic segment folder is [id], but its value is actually the slug
  const { id } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Edit an Event
        </h1>
        <Suspense fallback={<p>Loading form...</p>}>
          <EventFormServer slug={id} />
        </Suspense>
      </div>
    </div>
  );
};

export default EditEventPage;
