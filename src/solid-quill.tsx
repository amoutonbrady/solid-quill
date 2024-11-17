import { Dynamic } from "solid-js/web";
import { mergeProps, createEffect, JSX, onMount, splitProps } from "solid-js";

import type { EmitterSource, QuillOptions } from "quill";

import Quill from "quill";
import { Delta } from "quill/core";

function kebabCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const defaultValues: QuillOptions = {
  theme: "snow",

  formats: [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "size",
    "header",
    "link",
    "image",
    "video",
    "color",
    "background",
  ],

  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],

      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  },
};

const events = [
  "onEditorChange",
  "onScrollBeforeUpdate",
  "onScrollBlotMount",
  "onScrollBlotUnmount",
  "onScrollOptimize",
  "onScrollUpdate",
  "onScrollEmbedUpdate",
  "onSelectionChange",
  "onTextChange",
  "onCompositionBeforeStart",
  "onCompositionStart",
  "onCompositionBeforeEnd",
  "onCompositionEnd",
] as const;

export function SolidQuill(props: Props) {
  let quill: Quill;
  let editorRef!: HTMLElement;

  const mergedProps = mergeProps({ as: "div", ...defaultValues }, props);

  const [internal, otherProps] = splitProps(mergedProps, [
    "as",
    "ref",
    "onReady",
    ...events,
  ]);

  const [quillProps, externalProps] = splitProps(otherProps, [
    "debug",
    "modules",
    "placeholder",
    "readOnly",
    "theme",
    "formats",
    "bounds",
  ]);

  onMount(() => {
    quill = new Quill(editorRef, quillProps);

    for (const event of events) {
      if (!internal[event]) continue;

      const [modifier, ...eventParts] = kebabCase(event).split("-");
      quill[modifier](eventParts.join("-"), internal[event]);
    }

    if (internal.ref && typeof internal.ref === "function") {
      internal.ref(quill);
    }

    if (internal.onReady) {
      internal.onReady(quill);
    }
  });

  createEffect(() => {
    const state = quillProps.readOnly ? "disable" : "enable";
    quill[state]();
  });

  return (
    <Dynamic
      ref={editorRef}
      class="quill"
      component={internal.as}
      {...externalProps}
    />
  );
}

interface Props extends QuillOptions, JSX.HTMLAttributes<Quill> {
  as?: string;

  onReady?: (quill: Quill) => unknown;

  onEditorChange?: (...args: unknown[]) => unknown;
  onScrollBeforeUpdate?: (...args: unknown[]) => unknown;
  onScrollBlotMount?: (...args: unknown[]) => unknown;
  onScrollBlotUnmount?: (...args: unknown[]) => unknown;
  onScrollOptimize?: (...args: unknown[]) => unknown;
  onScrollUpdate?: (...args: unknown[]) => unknown;
  onScrollEmbedUpdate?: (...args: unknown[]) => unknown;
  onSelectionChange?: (range: Range, oldRange: Range, source: EmitterSource) => unknown;
  onTextChange?: (delta: Delta, oldContent: Delta, source: EmitterSource) => unknown;
  onCompositionBeforeStart?: (...args: unknown[]) => unknown;
  onCompositionStart?: (...args: unknown[]) => unknown;
  onCompositionBeforeEnd?: (...args: unknown[]) => unknown;
  onCompositionEnd?: (...args: unknown[]) => unknown;
}
