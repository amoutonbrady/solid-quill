# solid-quill

A [quilljs](https://quilljs.com/) wrapper for [Solid](https://github.com/ryansolid/solid).
This package is pretty new and probably incomplete in some way.

**PR & issues are much welcomed to help me fill in the missing pieces**

## Installation

This package has two peer-dependencies, [quill](http://npmjs.com/package/quill) and [solid-js](http://npmjs.com/package/solid-js)

```bash
# npm
$ npm install solid-quill solid-js quill

# pnpm
$ pnpm add solid-quill solid-js quill

# yarn
$ yarn add solid-quill solid-js quill
```

## Usage

This package leaves the whole state management to quill internals and therefore doesn't (yet at least) provide a way to do a controlled editor out of the box. The reason behind that decision is that while researching and playing myself with other editor (namely codemirror), I found that trying to get in the way to impose a controlled flow generally results in a Frankenstein of a package.

Initially, I would like to avoid being put in that situation and delegating to quill everything state related. You are provided with the quill instance and can do whatever you'd do with vanilla quill. This is just a wrapper meant to help integration within a solid application.

### Example usage

```tsx
const App: Component = () => {
  let q: Quill;

  onMount(() => {
    console.log(q);
    // log: undefined
    // This is because the `SolidQuill` component also needs to wait for
    // the element to be mounted to the dom bubbling the reference
    // upward to the parent component.
  });

  const init = (quill: Quill) => {
    console.assert(q.getText() === quill.getText());
  };

  return (
    <SolidQuill
      // Bind the `Quill` instance to the parent
      ref={q}
      // Which element to create (default to `div`)
      as="main"
      // Events
      onReady={init}
      onTextChange={console.log}
      onSelectionChange={console.log}
      onEditorChange={console.log}
      // Quill options
      debug={false}
      modules={} // see defaults below
      formats={} // see defaults below
      placeholder=""
      readOnly={false} // for now this is the only reactive props
      theme="snow"
      bounds={}
      scrollingContainer={}
      strict={}
      // All other props will be attached to the rendered
      // dom element, so you can add classes, styles, w/e
      class="quill"
      style="transform: rotate(90deg)"
      classList={{ active: true }}
    />
  );
};
```

### Listen to text change

```tsx
import Quill from "quill";
import { SolidQuill } from "solid-quill";

function App() {
  let quill: Quill;
  return (
    <SolidQuill ref={quill} onTextChange={() => console.log(quill.getText())} />
  );
}
```

## Default values

```tsx
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
```

## Contribute

1. Clone the project
2. `pnpm install` (you can install it via `npm i -g pnpm`)
3. You can use `pnpm dev` to start a local server and hack your wait around
