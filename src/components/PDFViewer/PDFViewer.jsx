import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { pdfjs } from "react-pdf";
import { elementScroll, useVirtualizer } from "@tanstack/react-virtual";
import { Document, Page } from "react-pdf";
import PDFUtil from "./PDFUtil";
import useVirtualizerVelocity from "./useVirtualizerVelocity";
import PageLoader from "./PageLoader";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFViewer = forwardRef((props, ref) => {
  const {
    initialScale,
    onDocumentLoad,
    children,
    file,
    ...rest
  } = props;
  const parentRef = useRef(null);
  const scrollingRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [viewports, setPageViewports] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [scale, setScale] = useState(initialScale); // Used for scaling the document to the value of scale
  const [defaultScale, setDefaultScale] = useState(null); // Used for reseting the scale when user zooms in/out

  const [viewportsReady, setViewportsReady] = useState(false);
  console.log(file);
  const scrollToFn = useCallback(
    (offset, canSmooth, instance) => {
      const duration = 400;
      const start = parentRef.current?.scrollTop || 0;
      const startTime = (scrollingRef.current = Date.now());
      // setIsSystemScrolling(true);

      const easeOutQuint = (t) => {
        return 1 - Math.pow(1 - t, 5);
      };

      const run = () => {
        if (scrollingRef.current !== startTime) return;
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = easeOutQuint(Math.min(elapsed / duration, 1));
        const interpolated = start + (offset - start) * progress;

        if (elapsed < duration) {
          elementScroll(interpolated, canSmooth, instance);
          requestAnimationFrame(run);
        } else {
          elementScroll(interpolated, canSmooth, instance);
          // setIsSystemScrolling(false);
        }
      };

      requestAnimationFrame(run);
    },
    [parentRef]
  );

  const estimateSize = useCallback(
    (index) => {
      if (!viewports || !viewports[index]) return 600;
      return viewports[index].height + 10;
    },
    [viewports]
  );

  const virtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize,
    overscan: 0,
    scrollToFn,
  });

  const jumpToPage = (pageIndex) => {
    virtualizer.scrollToIndex(pageIndex, {
      align: "start",
      // behavior: "smooth",
    });
  };

  const jumpToHighlightArea = (area) => {
    const startOffset = virtualizer.getOffsetForIndex(
      area.pageIndex,
      "start"
    )[0];
    const itemHeight = estimateSize(area.pageIndex);

    const offset = PDFUtil.getOffsetForHighlight({
      ...area,
      rotation: 0,
      itemHeight: itemHeight - 10, // accounts for padding top and bottom
      startOffset: startOffset - 5, // accounts for padding on top
    });

    virtualizer.scrollToOffset(offset, {
      align: "start",
    });
  };

  const getViewPort = (pageIndex) => {
    if (!viewportsReady) return null;
    return viewports && viewports[pageIndex] ? viewports[pageIndex] : null;
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        pdf,
        jumpToPage,
        jumpToHighlightArea,
        viewports,
        getViewPort,
      };
    },
    [viewportsReady]
  );

  useEffect(() => {
    if (!pdf) return;
    PDFUtil.getPageScale({ parent: parentRef.current, initialScale, pdf }).then(
      ({ scale, defaultScale }) => {
        setScale(scale);
        setDefaultScale(defaultScale);
      }
    );
  }, [pdf, initialScale]);

  useEffect(() => {
    setViewportsReady(false);

    PDFUtil.calculateViewports({ pdf, scale }).then((viewports) => {
      setPageViewports(viewports);
      setViewportsReady(true);
      virtualizer.measure();
    });
  }, [pdf, scale]);

  const onDocumentLoadSuccess = async (newPdf) => {
    setPdf(newPdf);
    setNumPages(newPdf.numPages);

    onDocumentLoad && onDocumentLoad(newPdf);
  };

  const { normalizedVelocity } = useVirtualizerVelocity({
    virtualizer,
    estimateSize,
  });

  const isScrollingFast = Math.abs(normalizedVelocity) > 1;
  const shouldRender = !isScrollingFast;

  return (
    <div
      id="pdf-document"
      ref={parentRef}
      style={{
        height: "100%",
        width: "100%",
        overflow: "auto",
        padding: "10px",
      }}
    >
      <Document
        file={file}
        {...rest}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={null}
      >
        <div
          id="pages-container"
          style={{
            width: "100%",
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {pdf && viewports && viewportsReady
            ? virtualizer.getVirtualItems().map((virtualItem) => {
                const viewport = getViewPort(virtualItem.index);
                const innerBoxWidth = viewport ? viewport.width + 5 : 0;

                return (
                  <div
                    key={virtualItem.index}
                    id="page-outer-container"
                    data-index={virtualItem.index}
                    style={{
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <div
                      id="page-container"
                      style={{
                        width: `${innerBoxWidth}px`,
                        height: `${
                          shouldRender ? "fit-content" : `${virtualItem.size}px`
                        }`,
                        margin: "0 auto",
                        boxShadow: "2px 2px 8px 0 rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      {shouldRender && (
                        <Page
                          pageIndex={virtualItem.index}
                          scale={scale}
                          loading={<PageLoader />}
                        >
                          {children &&
                            React.cloneElement(children, {
                              pageIndex: virtualItem.index,
                            })}
                        </Page>
                      )}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </Document>
    </div>
  );
});

export default PDFViewer;
