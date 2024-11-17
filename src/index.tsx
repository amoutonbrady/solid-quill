import Quill from "quill";
import "quill/dist/quill.snow.css";
import { render } from "solid-js/web";

import { SolidQuill } from "./solid-quill";

function App() {
  let q: Quill;
  return <SolidQuill ref={q} onTextChange={() => console.log(q.getText())} />;
}

const dispose = render(App, document.getElementById("app"));

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}
