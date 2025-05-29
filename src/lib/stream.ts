import { StreamChat } from "stream-chat";

/**
 * Note !: will throw an error if the env variable is null so no need to add a checking operation
 */

const streamServerClient = StreamChat.getInstance(
  process.env.STREAM_KEY!,
  process.env.STREAM_SECRET!,
);

export default streamServerClient;
