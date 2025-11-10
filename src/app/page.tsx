// src/app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import ClientChatPage from "@features/common/ClientChatPage";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <ClientChatPage session={session} />;
}
