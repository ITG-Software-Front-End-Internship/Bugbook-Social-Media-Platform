import { Metadata } from "next";
import Chat from "./components/chat/Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function page() {
  /**
   * Chat has to be a clinent component.
   */
  return <Chat />;
}
