import { Dynamic } from "solid-js/web";
import { mergeProps, createEffect, JSX, onMount, splitProps } from "solid-js";

import type {
  EditorChangeHandler,
  QuillOptionsStatic,
  SelectionChangeHandler,
  TextChangeHandler,
} from "quill";

import Quill from "quill";

function kebabCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const defaultValues: QuillOptionsStatic = {
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
    "clean",
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
  "onTextChange",
  "onSelectionChange",
  "onEditorChange",
  "onceTextChange",
  "onceSelectionChange",
  "onceEditorChange",
  "offTextChange",
  "offSelectionChange",
  "offEditorChange",
] as const;

export function SolidQuill(props: Props) {
  let editorRef!: HTMLElement;
  let quill: Quill;

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
    "scrollingContainer",
    "strict",
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

interface Props extends QuillOptionsStatic, JSX.HTMLAttributes<Quill> {
  as?: string;

  onReady?: (quill: Quill) => unknown;

  onTextChange?: (handler: TextChangeHandler) => unknown;
  onSelectionChange?: (handler: SelectionChangeHandler) => unknown;
  onEditorChange?: (handler: EditorChangeHandler) => unknown;

  onceTextChange?: (handler: TextChangeHandler) => unknown;
  onceSelectionChange?: (handler: SelectionChangeHandler) => unknown;
  onceEditorChange?: (handler: EditorChangeHandler) => unknown;

  offTextChange?: (handler: TextChangeHandler) => unknown;
  offSelectionChange?: (handler: SelectionChangeHandler) => unknown;
  offEditorChange?: (handler: EditorChangeHandler) => unknown;
}
