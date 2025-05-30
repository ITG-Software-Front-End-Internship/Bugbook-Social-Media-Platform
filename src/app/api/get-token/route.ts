import { cachedValidateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function GET() {
  try {
    const { user: loggedInUser } = await cachedValidateRequest();

    console.log(`Calling get token for user: ${loggedInUser?.id}`);

    if (!loggedInUser) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const MILISECONDS_IN_SECOND = 1000;
    const currentTimesInSeconds = Date.now() / MILISECONDS_IN_SECOND;

    const MINUTES_IN_HOUR = 60;
    const SECONDS_IN_MINUTE = 60;
    const NUMBER_OF_HOURS = 1;

    const HOURS_IN_SECONDS =
      NUMBER_OF_HOURS * MINUTES_IN_HOUR * SECONDS_IN_MINUTE;

    /** Will be valid for hours and refresh automatically */
    const expirationTime = Math.floor(currentTimesInSeconds) + HOURS_IN_SECONDS;

    const NUMBER_OF_MINUTES = 1;

    /**
     * We subtract 1m which is fixes time difference.
    
    * There might be a little difference btw time on the server and on the client.
    
    * Subtract 1m can be fixed the time difference now we pretend that this token was issued 1m eailer.
     */
    const issuedAt =
      Math.floor(currentTimesInSeconds) - NUMBER_OF_MINUTES * SECONDS_IN_MINUTE;

    const token = streamServerClient.createToken(
      loggedInUser.id,
      expirationTime,
      issuedAt,
    );

    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
