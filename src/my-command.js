import path from "path";
import sketch from "sketch";
import util from "util";
import dialog from "@skpm/dialog";

export default function() {
  const { selectedPage } = sketch.getSelectedDocument();

  let currentX = 0;

  dialog.showOpenDialog(
    {
      title: "Import SVG as Artboards",
      buttonLabel: "Import",
      filters: [{ name: "Svg", extensions: ["svg"] }],
      properties: ["openFile", "multiSelections"]
    },
    filepaths =>
      filepaths.forEach((filepath, i) => {
        const name = path.basename(filepath, ".svg");

        const importer = MSSVGImporter.svgImporter();
        if (importer.prepareToImportFromURL) {
          importer.prepareToImportFromURL(NSURL.fileURLWithPath(filepath));
        } else {
          importer.prepareToImportFromURL_error(NSURL.fileURLWithPath(filepath), null);
        }

        const viewBox = viewBoxForImporter(importer);
        if (viewBox.x != 0 || viewBox.y != 0) {
          recursivelyRebaseSVGElementToZeroOrigin(importer.graph().element(), viewBox);
        }

        const width = importer.graph().element().width();

        const frame = NSMakeRect(currentX, 0, width, importer.graph().element().height());
        const root = MSArtboardGroup.alloc().initWithFrame(frame);
        root.name = name;
        importer.graph().makeLayerWithParentLayer_progress(root, null);
        root.ungroupSingleChildDescendentGroups();
        importer.scale_rootGroup(importer.importer().scaleValue(), root);
        // The container might have shifted from the desired location a bit after scaling
        root.frame().setX(currentX);
        root.frame().setY(0);

        selectedPage.layers.unshift(root);

        currentX += root.frame().width() + 20;
      })
  );
}

function viewBoxForImporter(importer) {
  const raw = importer.graph().element().xml()
    .stringFromAttributeWithName("viewBox")
    .split(' ').map(Number);
  return { x: raw[0], y: raw[1], width: raw[2], height: raw[3] };
}

function recursivelyRebaseSVGElementToZeroOrigin(container, currentViewBox) {
  const children = util.toArray(container.children().allObjects());
  children.forEach(el => {
    if (el.isKindOfClass(SVGGroupElement)) {
      recursivelyRebaseSVGElementToZeroOrigin(el, currentViewBox);
    }
    else if (el.isKindOfClass(SVGCircleShape) || el.isKindOfClass(SVGEllipseShape)) {
      el.setCx(el.cx() - currentViewBox.x);
      el.setCy(el.cy() - currentViewBox.y);
    }
    else if (el.isKindOfClass(SVGText)) {
      el.setX(el.x() - currentViewBox.x);
      el.setY(el.y() - currentViewBox.y);
    }
    else if (el.isKindOfClass(SVGPathShape)) {
      const rebase = NSAffineTransform.transform();
      rebase.translateXBy_yBy(-currentViewBox.x, -currentViewBox.y);
      el.path().transformUsingAffineTransform(rebase);
    }
  });
}
