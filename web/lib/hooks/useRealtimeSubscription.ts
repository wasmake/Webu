"use client";

import { useEffect } from "react";

import { subscribeToChannel } from "@/lib/realtime/appwriteClient";

export function useRealtimeSubscription(channel: string, handler: (payload: unknown) => void) {
  useEffect(() => {
    if (!channel) return;
    const unsubscribe = subscribeToChannel(channel, handler);
    return () => {
      unsubscribe?.();
    };
  }, [channel, handler]);
}
