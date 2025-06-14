import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ChannelHeader, ChannelHeaderProps } from "stream-chat-react";

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

export default function CustomChannelHeader({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) {
  console.log(`CustomChannelHeader render ....`);

  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
