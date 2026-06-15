import { r as reactExports, j as jsxRuntimeExports, a0 as liveBrainBus } from "./index-CGYrnU7d.js";
import { a as Badge, B as Button } from "./button-BzchF_qZ.js";
import { P as Primitive, c as composeEventHandlers, a as createContextScope, e as createSlot, f as createContext2 } from "./index-D1cPK64R.js";
import { u as useComposedRefs, c as cn } from "./utils-DpgYLn5a.js";
import { u as useId, P as Portal$1, h as hideOthers, R as ReactRemoveScroll, a as useFocusGuards, F as FocusScope, D as DismissableLayer, C as ChevronDown } from "./index-CZW_fWIU.js";
import { u as useControllableState } from "./index-CYK4GiJv.js";
import { P as Presence, S as ScrollArea } from "./scroll-area-t--KCaVV.js";
import { c as createLucideIcon } from "./createLucideIcon-DM_w7VUb.js";
import { c as createArtifact } from "./artifactStore-By0EKKQ5.js";
import { S as Shield, R as RefreshCw, Z as Zap, C as CircleCheck, e as evaluateGoLive, T as TriangleAlert } from "./goLiveRuntime-DD6FM5RE.js";
import { C as CONTRACT_VERSION, P as PAYLOAD_SCHEMA_VERSION } from "./autoChecksReports-Di40MJQ_.js";
import { A as AnimatePresence } from "./index-BJO7udXR.js";
import { m as motion } from "./proxy-BnoGaVMl.js";
import "./regulationFoundation-CoSvCNLw.js";
import "./multiAgentScaleStore-BMPZOZcG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
var DIALOG_NAME = "Dialog";
var [createDialogContext] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog$1 = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog$1.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal$1 = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeDialog, forceMount, children: reactExports.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children: child }) })) });
};
DialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay$1.displayName = OVERLAY_NAME;
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent$1.displayName = CONTENT_NAME;
var DialogContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a;
          event.preventDefault();
          (_a = context.triggerRef.current) == null ? void 0 : _a.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a, _b;
          (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a, _b;
          (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    var _a;
    const describedById = (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog$1;
var Portal = DialogPortal$1;
var Overlay = DialogOverlay$1;
var Content = DialogContent$1;
var Title = DialogTitle$1;
var Close = DialogClose;
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
const SECTIONS = [
  {
    key: "core_runtime",
    title: "Runtime",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_runtime.panel"
  },
  {
    key: "core_regulation",
    title: "Regulation",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_regulation.panel"
  },
  {
    key: "core_circuit",
    title: "Circuitry / Memory / Prediction / Learning",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_circuit.panel"
  },
  {
    key: "core_efficiency",
    title: "Efficiency",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_efficiency.panel"
  },
  {
    key: "core_analytics",
    title: "Analytics / Validation",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_analytics.panel"
  },
  {
    key: "core_integration",
    title: "Integration",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_integration.panel"
  },
  {
    key: "core_live_battleops",
    title: "Live Deployment — Emergent BattleOps",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_live_battleops.panel"
  },
  {
    key: "core_live_warops",
    title: "Live Deployment — Emergent WarCommandOps",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_live_warops.panel"
  },
  {
    key: "core_reports",
    title: "Reports",
    group: "NeuroEmergence Core Go-Live Conditions",
    ocid: "golive.section.core_reports.panel"
  },
  {
    key: "shared_contract",
    title: "Shared Contract Conditions",
    group: "Section 5 — Shared Contract",
    ocid: "golive.section.shared_contract.panel"
  },
  {
    key: "blockers",
    title: "Active Go-Live Blockers",
    group: "Section 6 — Blockers",
    ocid: "golive.section.blockers.panel"
  }
];
function StatusIcon({ status }) {
  if (status === "pass") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CircleCheck,
      {
        className: "w-3.5 h-3.5 shrink-0",
        style: { color: "oklch(0.72 0.22 155)" }
      }
    );
  }
  if (status === "blocked") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TriangleAlert,
      {
        className: "w-3.5 h-3.5 shrink-0",
        style: { color: "oklch(0.72 0.22 45)" }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CircleX,
    {
      className: "w-3.5 h-3.5 shrink-0",
      style: { color: "oklch(0.62 0.22 25)" }
    }
  );
}
function ConditionRow({ condition }) {
  const isFailing = condition.status !== "pass";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2 py-1 px-2 rounded",
      style: {
        background: isFailing ? "oklch(0.14 0.04 20 / 0.4)" : "transparent"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { status: condition.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[10px] flex-1",
            style: {
              color: isFailing ? "oklch(0.75 0.08 20)" : "oklch(0.62 0.04 220)"
            },
            children: condition.label
          }
        ),
        isFailing && condition.blocker && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] px-1 py-0.5 rounded",
            style: {
              background: "oklch(0.62 0.22 25 / 0.2)",
              color: "oklch(0.72 0.18 25)",
              border: "1px solid oklch(0.62 0.22 25 / 0.4)"
            },
            children: "BLOCKER"
          }
        )
      ]
    }
  );
}
function SectionCard({
  title,
  conditions,
  ocid
}) {
  const [open, setOpen] = reactExports.useState(true);
  const passing = conditions.filter((c) => c.status === "pass").length;
  const total = conditions.length;
  const allPass = passing === total;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": ocid,
      className: "rounded border overflow-hidden",
      style: {
        background: "oklch(0.075 0.012 265)",
        borderColor: allPass ? "oklch(0.28 0.06 155)" : "oklch(0.28 0.08 20)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-2 px-3 py-2 text-left",
            onClick: () => setOpen(!open),
            style: { background: "oklch(0.09 0.015 265 / 0.5)" },
            children: [
              open ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: "w-3 h-3",
                  style: { color: "oklch(0.45 0.06 220)" }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronRight,
                {
                  className: "w-3 h-3",
                  style: { color: "oklch(0.45 0.06 220)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase flex-1",
                  style: { color: "oklch(0.65 0.06 220)" },
                  children: title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[9px]",
                  style: {
                    color: allPass ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)"
                  },
                  children: [
                    passing,
                    "/",
                    total
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-1.5 h-1.5 rounded-full",
                  style: {
                    background: allPass ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)",
                    boxShadow: allPass ? "0 0 6px oklch(0.72 0.22 155)" : "0 0 6px oklch(0.62 0.22 25)"
                  }
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 pb-2 pt-1 flex flex-col gap-0.5", children: conditions.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(ConditionRow, { condition: c }, c.id)) })
      ]
    }
  );
}
function ScoreRing({ score }) {
  const pct = Math.round(score * 100);
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * score;
  const color = pct >= 95 ? "oklch(0.72 0.22 155)" : pct >= 75 ? "oklch(0.82 0.2 80)" : "oklch(0.62 0.22 25)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex items-center justify-center",
      style: { width: 96, height: 96 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: "96",
            height: "96",
            className: "-rotate-90",
            style: { position: "absolute" },
            "aria-label": "Go-live score ring",
            role: "img",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Go-live score ring" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: "48",
                  cy: "48",
                  r,
                  fill: "none",
                  stroke: "oklch(0.15 0.03 265)",
                  strokeWidth: "6"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: "48",
                  cy: "48",
                  r,
                  fill: "none",
                  stroke: color,
                  strokeWidth: "6",
                  strokeDasharray: `${dash} ${circ}`,
                  strokeLinecap: "round",
                  style: {
                    filter: `drop-shadow(0 0 4px ${color})`,
                    transition: "stroke-dasharray 0.6s ease"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xl font-bold", style: { color }, children: [
            pct,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest",
              style: { color: "oklch(0.38 0.05 220)" },
              children: "PASS RATE"
            }
          )
        ] })
      ]
    }
  );
}
function SystemBadge({ label, ready }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-1.5 px-2 py-1 rounded",
      style: {
        background: ready ? "oklch(0.72 0.22 155 / 0.08)" : "oklch(0.62 0.22 25 / 0.08)",
        border: `1px solid ${ready ? "oklch(0.72 0.22 155 / 0.3)" : "oklch(0.62 0.22 25 / 0.3)"}`
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-1.5 h-1.5 rounded-full",
            style: {
              background: ready ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)",
              boxShadow: ready ? "0 0 5px oklch(0.72 0.22 155)" : "0 0 5px oklch(0.62 0.22 25)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[9px]",
            style: { color: "oklch(0.6 0.05 220)" },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[8px] font-bold tracking-widest",
            style: {
              color: ready ? "oklch(0.72 0.22 155)" : "oklch(0.62 0.22 25)"
            },
            children: ready ? "READY" : "BLOCKED"
          }
        )
      ]
    }
  );
}
function GoLiveDeclarationTab({
  neural: _neural
}) {
  const [result, setResult] = reactExports.useState(null);
  const [evaluating, setEvaluating] = reactExports.useState(false);
  const [declarationOpen, setDeclarationOpen] = reactExports.useState(false);
  const [declared, setDeclared] = reactExports.useState(false);
  const [busPacketsTick, setBusPacketsTick] = reactExports.useState(0);
  const prevPacketsRef = reactExports.useRef(0);
  const runEval = () => {
    setEvaluating(true);
    setTimeout(() => {
      const r = evaluateGoLive();
      setResult(r);
      setEvaluating(false);
      const _pc = r.conditions.filter((c) => c.status === "pass").length;
      const _fc = r.conditions.filter((c) => c.status === "fail").length;
      const _wc = r.conditions.filter((c) => c.status === "blocked").length;
      createArtifact({
        artifact_type: "go_live_report",
        source_system: "core",
        title: `Go-Live Evaluation — ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
        summary: `Score: ${r.score}% | ${_pc} passed / ${_fc} failed / ${_wc} warnings. Verdict: ${r.overallVerdict}`,
        score: r.score,
        status: r.overallVerdict === "GO_LIVE_COMPLETE" ? "pass" : _fc > 0 ? "fail" : "warn",
        ai_review_summary: r.overallVerdict === "GO_LIVE_COMPLETE" ? "System is ready for deployment. All go-live conditions satisfied." : `Deployment blocked. ${_fc} conditions failed. Blockers: ${r.blockers.slice(0, 2).join("; ")}`,
        metadata: {
          passed: _pc,
          failed: _fc,
          warnings: _wc,
          verdict: r.overallVerdict,
          core_ready: r.coreReady
        },
        related_artifact_ids: [],
        tags: [
          "go_live",
          "readiness",
          r.overallVerdict === "GO_LIVE_COMPLETE" ? "pass" : "blocked"
        ],
        version: "1.0.0"
      });
    }, 600);
  };
  reactExports.useEffect(() => {
    liveBrainBus.start();
    runEval();
  }, []);
  reactExports.useEffect(() => {
    const id = setInterval(() => setBusPacketsTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    const current = liveBrainBus.getBusStatus().packetsReturned;
    if (prevPacketsRef.current === 0 && current > 0) {
      runEval();
    }
    prevPacketsRef.current = current;
  }, [busPacketsTick]);
  const isLive = (result == null ? void 0 : result.overallVerdict) === "GO_LIVE_COMPLETE";
  const busPackets = liveBrainBus.getBusStatus().packetsReturned;
  const payloadGatePassed = busPackets > 0;
  const bySection = (key) => (result == null ? void 0 : result.conditions.filter((c) => c.section === key)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "oklch(0.055 0.01 265)", overflow: "hidden" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "shrink-0 px-4 py-3 border-b flex items-start gap-3",
            style: {
              background: "oklch(0.065 0.012 265)",
              borderColor: "oklch(0.18 0.04 255)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 pt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Shield,
                {
                  className: "w-4 h-4",
                  style: { color: "oklch(0.72 0.22 195)" }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-xs font-bold tracking-widest uppercase",
                      style: { color: "oklch(0.82 0.15 195)" },
                      children: "GO-LIVE DECLARATION PACK"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      className: "font-mono text-[8px] tracking-wider",
                      style: {
                        background: "oklch(0.72 0.22 195 / 0.12)",
                        color: "oklch(0.72 0.22 195)",
                        border: "1px solid oklch(0.72 0.22 195 / 0.3)"
                      },
                      children: [
                        "CONTRACT v",
                        CONTRACT_VERSION
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      className: "font-mono text-[8px] tracking-wider",
                      style: {
                        background: "oklch(0.65 0.18 280 / 0.12)",
                        color: "oklch(0.65 0.18 280)",
                        border: "1px solid oklch(0.65 0.18 280 / 0.3)"
                      },
                      children: [
                        "SCHEMA v",
                        PAYLOAD_SCHEMA_VERSION
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-mono text-[9px] mt-0.5",
                    style: { color: "oklch(0.38 0.05 220)" },
                    children: "Final Shared Activation Contract — NeuroEmergence Core × Emergent BattleOps × Emergent WarCommandOps"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "golive.run_eval.button",
                  size: "sm",
                  onClick: runEval,
                  disabled: evaluating,
                  className: "shrink-0 font-mono text-[9px] tracking-widest uppercase h-7 px-3",
                  style: {
                    background: "oklch(0.72 0.22 195 / 0.15)",
                    color: "oklch(0.72 0.22 195)",
                    border: "1px solid oklch(0.72 0.22 195 / 0.4)"
                  },
                  children: [
                    evaluating ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 animate-spin mr-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mr-1" }),
                    evaluating ? "Evaluating…" : "Run Evaluation"
                  ]
                }
              )
            ]
          }
        ),
        payloadGatePassed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-2 shrink-0 flex items-center gap-3",
            style: {
              background: "oklch(0.12 0.05 140)",
              borderBottom: "1px solid oklch(0.72 0.22 140 / 0.4)"
            },
            "data-ocid": "golive.packet_gate.success_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "oklch(0.72 0.22 140)",
                    boxShadow: "0 0 10px oklch(0.72 0.22 140)",
                    flexShrink: 0
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[9px] font-bold tracking-widest",
                  style: { color: "oklch(0.82 0.22 140)" },
                  children: [
                    "PACKET GATE CLEARED — ",
                    busPackets,
                    " packet",
                    busPackets !== 1 ? "s" : "",
                    " confirmed"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px]",
                  style: { color: "oklch(0.55 0.12 140)" },
                  children: [
                    "· Go-Live eligible ·",
                    " ",
                    isLive ? "All conditions passed — click Declare to confirm" : "Run Evaluation to check remaining conditions"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "golive.panel",
                className: "rounded border p-3 mb-1",
                style: {
                  background: payloadGatePassed ? "oklch(0.08 0.02 155)" : "oklch(0.08 0.02 25)",
                  borderColor: payloadGatePassed ? "oklch(0.28 0.12 155)" : "oklch(0.28 0.12 25)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          color: payloadGatePassed ? "oklch(0.72 0.2 155)" : "oklch(0.72 0.22 25)"
                        },
                        children: payloadGatePassed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[9px] font-bold",
                        style: {
                          color: payloadGatePassed ? "oklch(0.72 0.2 155)" : "oklch(0.72 0.22 25)"
                        },
                        children: [
                          "Live payload flow confirmed (",
                          busPackets,
                          " packets)"
                        ]
                      }
                    ),
                    !payloadGatePassed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "ml-auto font-mono text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
                        style: {
                          background: "oklch(0.28 0.12 25)22",
                          color: "oklch(0.72 0.22 25)",
                          border: "1px solid oklch(0.28 0.12 25)"
                        },
                        children: "BLOCKING"
                      }
                    )
                  ] }),
                  !payloadGatePassed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-[8px] mt-1 ml-5",
                      style: { color: "oklch(0.55 0.1 25)" },
                      children: "Start simulation and begin an adapter session to generate live payload flow"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-widest uppercase px-1 pb-1",
                style: { color: "oklch(0.45 0.08 195)" },
                children: "Section 2 — NeuroEmergence Core Go-Live Conditions"
              }
            ),
            SECTIONS.filter((s) => s.key.startsWith("core_")).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionCard,
              {
                title: s.title,
                conditions: bySection(s.key),
                ocid: s.ocid
              },
              s.key
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-widest uppercase px-1 pb-1 mt-2",
                style: { color: "oklch(0.45 0.08 195)" },
                children: "Section 5 — Shared Contract Conditions"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionCard,
              {
                title: "Shared Contract Conditions",
                conditions: bySection("shared_contract"),
                ocid: "golive.section.shared_contract.panel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-widest uppercase px-1 pb-1 mt-2",
                style: { color: "oklch(0.55 0.18 25)" },
                children: "Section 6 — Active Go-Live Blockers"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionCard,
              {
                title: "Active Blocker Checks",
                conditions: bySection("blockers"),
                ocid: "golive.section.blockers.panel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-widest uppercase px-1 pb-1 mt-2",
                style: { color: "oklch(0.45 0.08 195)" },
                children: "Section 7 — Required Go-Live Proof"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "golive.proofs.panel",
                className: "rounded border p-3",
                style: {
                  background: "oklch(0.075 0.012 265)",
                  borderColor: "oklch(0.18 0.04 255)"
                },
                children: result ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: Object.entries(result.proofs).map(([key, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] shrink-0",
                      style: {
                        color: "oklch(0.45 0.06 220)",
                        minWidth: "200px"
                      },
                      children: key
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[9px] break-all",
                      style: { color: "oklch(0.72 0.18 155)" },
                      children: val
                    }
                  )
                ] }, key)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px]",
                    style: { color: "oklch(0.38 0.05 220)" },
                    children: "Run evaluation to populate proofs"
                  }
                )
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-64 shrink-0 border-l flex flex-col gap-3 p-3 overflow-y-auto",
              style: {
                background: "oklch(0.065 0.012 265)",
                borderColor: "oklch(0.18 0.04 255)"
              },
              "data-ocid": "golive.verdict.panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreRing, { score: (result == null ? void 0 : result.score) ?? 0 }),
                  evaluating && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest animate-pulse",
                      style: { color: "oklch(0.55 0.08 195)" },
                      children: "EVALUATING…"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] tracking-widest uppercase",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: "System Status"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SystemBadge,
                    {
                      label: "NeuroEmergence Core",
                      ready: (result == null ? void 0 : result.coreReady) ?? false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SystemBadge,
                    {
                      label: "Emergent BattleOps",
                      ready: (result == null ? void 0 : result.battleOpsReady) ?? false
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SystemBadge,
                    {
                      label: "Emergent WarCommandOps",
                      ready: (result == null ? void 0 : result.warCommandOpsReady) ?? false
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "rounded p-2 text-center",
                    style: {
                      background: isLive ? "oklch(0.72 0.22 155 / 0.08)" : "oklch(0.62 0.22 25 / 0.08)",
                      border: `1px solid ${isLive ? "oklch(0.72 0.22 155 / 0.4)" : "oklch(0.62 0.22 25 / 0.4)"}`
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[10px] font-bold tracking-widest",
                        style: {
                          color: isLive ? "oklch(0.82 0.22 155)" : "oklch(0.72 0.18 25)"
                        },
                        children: result ? isLive ? "✓ GO-LIVE COMPLETE" : `BLOCKED — ${result.blockers.length} conditions unmet` : "AWAITING EVALUATION"
                      }
                    )
                  }
                ),
                result && result.blockers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "golive.blockers.panel",
                    className: "rounded border p-2 flex flex-col gap-1",
                    style: {
                      background: "oklch(0.09 0.015 265)",
                      borderColor: "oklch(0.35 0.1 20)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] tracking-widest uppercase",
                          style: { color: "oklch(0.62 0.18 25)" },
                          children: "Active Blockers"
                        }
                      ),
                      result.blockers.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[8px] shrink-0",
                            style: { color: "oklch(0.5 0.1 25)" },
                            children: [
                              i + 1,
                              "."
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[8px]",
                            style: { color: "oklch(0.65 0.12 25)" },
                            children: b
                          }
                        )
                      ] }, b))
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "golive.declare.button",
                    className: "w-full font-mono text-[9px] tracking-widest uppercase h-9",
                    disabled: !isLive || !result || !payloadGatePassed,
                    onClick: () => setDeclarationOpen(true),
                    style: {
                      background: isLive && payloadGatePassed ? "oklch(0.72 0.22 155 / 0.2)" : "oklch(0.15 0.02 265)",
                      color: isLive && payloadGatePassed ? "oklch(0.82 0.22 155)" : "oklch(0.35 0.04 220)",
                      border: `1px solid ${isLive && payloadGatePassed ? "oklch(0.72 0.22 155 / 0.5)" : "oklch(0.25 0.03 265)"}`,
                      boxShadow: isLive && payloadGatePassed ? "0 0 12px oklch(0.72 0.22 155 / 0.2)" : "none"
                    },
                    children: isLive && payloadGatePassed ? "⚡ Declare Go-Live" : !payloadGatePassed ? "Blocked — Payload gate: start simulation + begin session" : `Blocked — ${(result == null ? void 0 : result.blockers.length) ?? "?"} unmet conditions`
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-wrap pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] px-1.5 py-0.5 rounded",
                      style: {
                        background: "oklch(0.72 0.22 195 / 0.08)",
                        color: "oklch(0.5 0.1 195)",
                        border: "1px solid oklch(0.72 0.22 195 / 0.2)"
                      },
                      children: [
                        "CONTRACT ",
                        CONTRACT_VERSION
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px] px-1.5 py-0.5 rounded",
                      style: {
                        background: "oklch(0.65 0.18 280 / 0.08)",
                        color: "oklch(0.5 0.1 280)",
                        border: "1px solid oklch(0.65 0.18 280 / 0.2)"
                      },
                      children: [
                        "SCHEMA ",
                        PAYLOAD_SCHEMA_VERSION
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: declarationOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: declarationOpen, onOpenChange: setDeclarationOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            "data-ocid": "golive.declaration.modal",
            className: "max-w-lg",
            style: {
              background: "oklch(0.07 0.015 265)",
              border: "1px solid oklch(0.72 0.22 155 / 0.5)",
              boxShadow: "0 0 40px oklch(0.72 0.22 155 / 0.15)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: -8 },
                  animate: { opacity: 1, y: 0 },
                  className: "flex flex-col items-center gap-2 pt-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-12 h-12 rounded-full flex items-center justify-center",
                        style: {
                          background: "oklch(0.72 0.22 155 / 0.15)",
                          border: "1px solid oklch(0.72 0.22 155 / 0.5)",
                          boxShadow: "0 0 20px oklch(0.72 0.22 155 / 0.3)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          CircleCheck,
                          {
                            className: "w-6 h-6",
                            style: { color: "oklch(0.82 0.22 155)" }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-sm font-bold tracking-widest",
                        style: { color: "oklch(0.82 0.22 155)" },
                        children: declared ? "GO-LIVE COMPLETE" : "Declare Go-Live"
                      }
                    )
                  ]
                }
              ) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded p-3 my-2 font-mono text-[8px] leading-relaxed",
                  style: {
                    background: "oklch(0.055 0.01 265)",
                    border: "1px solid oklch(0.22 0.04 255)",
                    color: "oklch(0.5 0.06 220)"
                  },
                  children: declared ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "flex flex-col gap-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.82 0.22 155)" }, children: [
                          "GO-LIVE COMPLETE — ",
                          (/* @__PURE__ */ new Date()).toISOString()
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Every section in the GO-LIVE DECLARATION PACK has passed." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No blocker exists." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Proof exists for all live flows." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "All three systems are live together:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.72 0.22 195)" }, children: [
                          " ",
                          "✓ NeuroEmergence Core — LIVE"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.72 0.22 195)" }, children: [
                          " ",
                          "✓ Emergent BattleOps — LIVE"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "oklch(0.72 0.22 195)" }, children: [
                          " ",
                          "✓ Emergent WarCommandOps — LIVE"
                        ] })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "The developer declares:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1", children: '"GO-LIVE COMPLETE"' }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1", children: "All sections in this pack pass." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No blocker exists." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Proof exists for all live flows." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "All three systems are live together." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "mt-2",
                        style: { color: "oklch(0.62 0.12 45)" },
                        children: "This action is final. Confirm to declare the stack GO-LIVE."
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2", children: !declared ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "golive.declaration.close_button",
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setDeclarationOpen(false),
                    className: "font-mono text-[9px] tracking-wider",
                    style: { color: "oklch(0.45 0.05 220)" },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "golive.declaration.confirm_button",
                    size: "sm",
                    onClick: () => setDeclared(true),
                    className: "font-mono text-[9px] tracking-widest uppercase",
                    style: {
                      background: "oklch(0.72 0.22 155 / 0.2)",
                      color: "oklch(0.82 0.22 155)",
                      border: "1px solid oklch(0.72 0.22 155 / 0.5)"
                    },
                    children: "⚡ Confirm Go-Live"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "golive.declaration.close_button",
                  size: "sm",
                  onClick: () => setDeclarationOpen(false),
                  className: "font-mono text-[9px] tracking-widest uppercase",
                  style: {
                    background: "oklch(0.72 0.22 155 / 0.15)",
                    color: "oklch(0.72 0.22 155)",
                    border: "1px solid oklch(0.72 0.22 155 / 0.3)"
                  },
                  children: "Close"
                }
              ) })
            ]
          }
        ) }) })
      ]
    }
  );
}
export {
  GoLiveDeclarationTab as default
};
