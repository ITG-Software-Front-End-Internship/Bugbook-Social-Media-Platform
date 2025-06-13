import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { UserResponse } from "stream-chat";
import SelectedUserTag from "./SelectedUserTag";
import UserResult from "./UserResult";

type SuccessUserStreamFetch = {
  isSuccess: boolean;
  streamUsers: UserResponse[];
};

type ErrorUserStreamFetch = {
  isError: boolean;
};

type FetchingUserStreamFetch = {
  isFetching: boolean;
};

type SelectedUsersProps = {
  selectedUsers: UserResponse[];
  setSelectedUsers: Dispatch<SetStateAction<UserResponse[]>>;
};

type Props = SelectedUsersProps &
  (SuccessUserStreamFetch | ErrorUserStreamFetch | FetchingUserStreamFetch);

export default function UserSelector(props: Props) {
  const { selectedUsers, setSelectedUsers } = props;

  // Narrow down the union props safely
  const isSuccess = "isSuccess" in props && props.isSuccess;
  const isError = "isError" in props && props.isError;
  const isFetching = "isFetching" in props && props.isFetching;

  const streamUsers = isSuccess ? props.streamUsers : [];

  return (
    <>
      {!!selectedUsers.length && (
        <div className="mt-4 flex flex-wrap gap-2 p-2">
          {selectedUsers.map((user) => (
            <SelectedUserTag
              key={user.id}
              user={user}
              onRemove={() => {
                setSelectedUsers((prev) =>
                  prev.filter((u) => u.id !== user.id),
                );
              }}
            />
          ))}
        </div>
      )}

      <div className="h-96 overflow-y-auto">
        {isSuccess && streamUsers.length === 0 && (
          <p className="my-3 text-center text-muted-foreground">
            No users found. Try a different name.
          </p>
        )}
        {isSuccess &&
          streamUsers.map((user) => (
            <UserResult
              key={user.id}
              user={user}
              selected={selectedUsers.some((u) => u.id === user.id)}
              onClick={() => {
                setSelectedUsers((prevSelectedUsers) => {
                  const isUserSelected = prevSelectedUsers.some(
                    (selectedUser) => selectedUser.id === user.id,
                  );

                  if (isUserSelected) {
                    return prevSelectedUsers.filter(
                      (selectedUser) => selectedUser.id !== user.id,
                    );
                  } else {
                    return [...prevSelectedUsers, user];
                  }
                });
              }}
            />
          ))}
        {isFetching && <Loader2 className="mx-auto my-3 animate-spin" />}
        {isError && (
          <p className="my-3 text-center text-destructive">
            An error occurred while loading users.
          </p>
        )}
      </div>
    </>
  );
}
