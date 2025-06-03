import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { headerTranslations } from "@/lib/translationKeys";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export default function ThemeDropdownMenu() {
  console.log(`ThemeDropdownMenu render ...`);

  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  return (
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 size-4" />
          {t(headerTranslations.userButton.theme.systemDefault)}
          {theme === "default" && <Check className="ms-2 size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 size-4" />
          {t(headerTranslations.userButton.theme.light)}
          {theme === "light" && <Check className="ms-2 size-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 size-4" />
          {t(headerTranslations.userButton.theme.dark)}
          {theme === "dark" && <Check className="ms-2 size-4" />}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  );
}
