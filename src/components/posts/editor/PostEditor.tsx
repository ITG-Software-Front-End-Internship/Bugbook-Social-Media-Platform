"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/customComponents/UserAvatar";
import { Button } from "@/components/ui/button";
import PlaceHolder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import submitPost from "./actions";
import "./styles.css";

export default function PostEditor() {
  const { user } = useSession();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      PlaceHolder.configure({
        placeholder: "What's going on?",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    await submitPost(input);
    editor?.commands.clearContent();
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
        <div className="flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={!input.trim()}
            className="min-w-20 select-none"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
