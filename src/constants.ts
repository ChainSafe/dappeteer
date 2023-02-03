import path from "path";
import { getDappateerPath } from "./helpers/utils";

export const EXAMPLE_WEBSITE = "http://example.org";

export const RECOMMENDED_METAMASK_VERSION = "v10.24.2";

export const DEFAULT_METAMASK_USERDATA = path.join(
  getDappateerPath(),
  "userData/chrome-mm"
);
export const DEFAULT_FLASK_USERDATA = path.join(
  getDappateerPath(),
  "userData/chrome-flask"
);
