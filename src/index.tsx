import Quill from "quill";
import "quill/dist/quill.snow.css";
import { render } from "solid-js/web";

import { SolidQuill } from "./solid-quill";

function App() {
  let q: Quill;

  const init = (quill: Quill) => {
    console.log(q);
    console.log(quill);
    console.assert(q.getText() === quill.getText());
  };

  return <SolidQuill onReady={init} ref={q} />;
}

const dispose = render(App, document.getElementById("app"));

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}
