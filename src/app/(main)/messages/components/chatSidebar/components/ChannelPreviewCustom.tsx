import {
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";

interface ChannelPreviewCustomProps {
  props: ChannelPreviewUIComponentProps;
  onClose: () => void;
}

export const ChannelPreviewCustom = ({
  props,
  onClose,
}: ChannelPreviewCustomProps) => {
  return (
    <ChannelPreviewMessenger
      {...props}
      onSelect={() => {
        /** We override the default behavior to open the chat channel that we click on and close the sidebar */
        props.setActiveChannel?.(props.channel, props.watchers);
        onClose();
      }}
    />
  );
};
