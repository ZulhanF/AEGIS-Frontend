import { useState, useCallback } from "react";
import { getTickets, createTicket, deleteTicket, updateTicket } from "@/utils/api";

// Custom hook untuk mengelola state tiket dari API
export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await getTickets();

      if (!error) {
        setTickets(data);
      } else {
        setError("Failed to fetch tickets");
        console.error("Error fetching tickets:", error);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const useCreateTicket = useCallback(async (newTicket) => {
    try {
      const { error, data } = await createTicket(newTicket);
      if (!error) {
        setTickets((prevTickets) => [data, ...prevTickets]);
        return data;
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (err) {
      console.error("Error creating ticket:", err);
      throw err;
    }
  }, []);

  const useDeleteTicket = useCallback(async (ticketId) => {
    try {
      const { error } = await deleteTicket(ticketId);
      if (!error) {
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== ticketId)
        );
      } else {
        throw new Error("Failed to delete ticket");
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
      throw err;
    }
  }, []);

  const useEditTicket = useCallback(async (ticketId, updatedTicket) => {
    try {
      const { error, data } = await updateTicket(ticketId, updatedTicket);
      if (!error) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketId ? data : ticket
          )
        );
        return data;
      } else {
        throw new Error("Failed to update ticket", error);
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      throw err;
    }
  }, []);
  return {
    tickets,
    loading,
    error,
    fetchTickets,
    useCreateTicket,
    useDeleteTicket,
    useEditTicket,
  };
}
