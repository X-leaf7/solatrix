import { REST_API_BASE_URL } from "@/shared/constants";

export const fetchEvent = async (id: string) => {
  const apiUrl = `/api/events/${id}`;

  const url = `${REST_API_BASE_URL}/api/events/${id}/`

  console.log('sending request', apiUrl)
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch event with id ${id}`);
  }

  return res.json();
};
