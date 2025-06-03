import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import { Button, buttonVariants } from "../ui/button";

type LoadingButtonVariantsProps = VariantProps<typeof buttonVariants>;

interface LoadingButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  isLoading: boolean;
}
function LoadingButton({
  variant,
  size,
  className,
  asChild = false,
  isLoading,
  disabled,
  ...props
}: LoadingButtonProps & LoadingButtonVariantsProps) {
  console.log(`Loading button render ...`);

  return (
    <Button
      disabled={isLoading || disabled}
      className={cn("flex items-center justify-center gap-2", className)}
      variant={variant}
      size={size}
      {...props}
    >
      <>
        {isLoading && <Loader2 className="size-5 animate-spin" />}
        {props.children}
      </>
    </Button>
  );
}

export default memo(LoadingButton);
