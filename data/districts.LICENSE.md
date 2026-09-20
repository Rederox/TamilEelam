# District geometry attribution

`districts.ts` contains derived administrative geometry from © OpenStreetMap contributors, distributed by geoBoundaries. The source metadata identifies Wambacher / OpenStreetMap, year represented 2017, boundary ID `LKA-ADM2-46371173`.

The derived geometry is made available under the [Open Data Commons Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). See also [OpenStreetMap copyright and attribution](https://www.openstreetmap.org/copyright).

Pinned source: https://github.com/wmgeolab/geoBoundaries/blob/9469f09/releaseData/gbOpen/LKA/ADM2/geoBoundaries-LKA-ADM2_simplified.geojson

Metadata: https://www.geoboundaries.org/api/current/gbOpen/LKA/ADM2/

Changes: polygon coordinates converted to SVG paths using the existing atlas projection, rounded to one decimal. Administrative geography and editorial colouring are separate: the nine highlighted districts reproduce the user's supplied visual reference. They are not a representation of military control at a particular date.

Regenerate with `python3 scripts/generate-districts.py`. The runtime atlas needs no third-party map requests.
