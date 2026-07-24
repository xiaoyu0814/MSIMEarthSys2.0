/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.130
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import {
  EllipseGeometry_default
} from "./chunk-3VA2EE6L.js";
import "./chunk-TDBV5YZV.js";
import "./chunk-V6CD5UCR.js";
import "./chunk-HHD4SZB7.js";
import "./chunk-RN5ZTQ3C.js";
import "./chunk-EHB2OCQX.js";
import "./chunk-2AXPWBJG.js";
import "./chunk-EXEZHW3P.js";
import "./chunk-2IPCRNNT.js";
import "./chunk-4UKBB5GV.js";
import "./chunk-QUSP3NWA.js";
import "./chunk-F4ZAKN4V.js";
import "./chunk-4H6CP6BZ.js";
import "./chunk-ILCKVXKQ.js";
import "./chunk-X47XVLPX.js";
import "./chunk-UK33ZN4K.js";
import {
  Cartesian3_default,
  Ellipsoid_default
} from "./chunk-VGJSKEIB.js";
import "./chunk-NR7KSD56.js";
import "./chunk-5OL6XFNS.js";
import "./chunk-HS76VTVY.js";
import "./chunk-WYCR5DWQ.js";
import {
  defined_default
} from "./chunk-FPYBD2P5.js";

// packages/engine/Source/Workers/createEllipseGeometry.js
function createEllipseGeometry(ellipseGeometry, offset) {
  if (defined_default(offset)) {
    ellipseGeometry = EllipseGeometry_default.unpack(ellipseGeometry, offset);
  }
  ellipseGeometry._center = Cartesian3_default.clone(ellipseGeometry._center);
  ellipseGeometry._ellipsoid = Ellipsoid_default.clone(ellipseGeometry._ellipsoid);
  return EllipseGeometry_default.createGeometry(ellipseGeometry);
}
var createEllipseGeometry_default = createEllipseGeometry;
export {
  createEllipseGeometry_default as default
};
