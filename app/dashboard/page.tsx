import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import EventsTable from "@/components/EventsTable";
import { IEvent } from "@/database/event.model";
import { Suspense } from "react";

const EventManagement = async () => {
  const events: IEvent[] = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
    { cache: "no-store" }
  )
    .then((res) => res.json())
    .then((data) => data.events);

  const queryClient = new QueryClient();
  queryClient.setQueryData(["events"], events);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading...</p>}>
        <EventsTable key="events-table" events={events} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default EventManagement;
