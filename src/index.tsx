import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { CourseDatabase } from "./model/course-database";

(async () => {
  await CourseDatabase.getInstance().load();
  ReactDOM.render(<App />, document.getElementById("react-root"));
})();
