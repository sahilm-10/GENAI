import { Util } from "pdfjs-dist";

class PDFUtil extends Util {
  static determineScale = (parentElement, width, reservedWidth = 50) => {
    const scaleWidth = (parentElement.clientWidth - reservedWidth) / width;
    return scaleWidth;
  };

  static getPageScale = async ({ parent, pdf, initialScale }) => {
    const firstPage = await pdf.getPage(1);
    const firstViewPort = firstPage.getViewport({
      scale: 1,
      rotation: 0,
    });

    const newScale = this.determineScale(parent, firstViewPort.width);
    return {
      defaultScale: newScale,
      scale: initialScale ? initialScale : newScale,
    };
  };

  static calculateViewports = async ({ pdf, scale }) => {
    if (!pdf || scale === undefined) return;

    const viewports = await Promise.all(
      Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1);
        const viewport = page.getViewport({
          scale: scale,
          rotation: 0,
        });
        return viewport;
      })
    );

    return viewports;
  };

  static getOffsetForHighlight = ({ top, itemHeight, startOffset }) => {
    let extraOffset = (top * itemHeight) / itemHeight;

    return startOffset + extraOffset;
  };

  static convertToViewportRectangle = (rect, viewport) => {
    const [x1, y1] = Util.applyTransform(
      [rect[0], rect[1]],
      viewport.transform
    );
    const [x2, y2] = Util.applyTransform(
      [rect[2], rect[3]],
      viewport.transform
    );

    return {
      left: Math.min(x1, x2),
      top: Math.min(y1, y2),
      width: Math.abs(x1 - x2),
      height: Math.abs(y1 - y2),
    };
  };
}
export default PDFUtil;
