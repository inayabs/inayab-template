import { auth } from "@/auth";

export const fetchClient = async (url, options) => {
  const session = await auth();
  console.log(`From the fetchClient ${JSON.stringify.session?.user.token}`);

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      ...(session && { Authorization: `Bearer ${session?.user.token}` }),
    },
  });
};
