import { r as reactExports, j as jsxRuntimeExports, X as reactDomExports, a0 as liveBrainBus, ai as useHiveMindState } from "./index-CGYrnU7d.js";
import { a as Badge, B as Button } from "./button-BzchF_qZ.js";
import { u as useComposedRefs, c as cn } from "./utils-DpgYLn5a.js";
import { P as Primitive, c as composeEventHandlers, a as createContextScope, u as useLayoutEffect2, b as useDirection, e as createSlot, d as clamp$1 } from "./index-D1cPK64R.js";
import { u as useControllableState } from "./index-CYK4GiJv.js";
import { u as usePrevious, a as useSize, c as createCollection, S as Slider } from "./slider-CctgkOI-.js";
import { P as Presence, u as useCallbackRef, S as ScrollArea } from "./scroll-area-t--KCaVV.js";
import { c as createLucideIcon } from "./createLucideIcon-DM_w7VUb.js";
import { P as Primitive$1 } from "./index-BUG7VRh9.js";
import { u as useId, P as Portal$1, h as hideOthers, a as useFocusGuards, R as ReactRemoveScroll, F as FocusScope, D as DismissableLayer, C as ChevronDown } from "./index-CZW_fWIU.js";
import { A as AvatarBrainChip } from "./AvatarBrainChip-BC2vhMZs.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode);
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME$2 = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME$2, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME$2;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME$1 = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME$1, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME$1;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
var NAME$2 = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive$1.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME$2;
var Root$2 = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$2,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const sides = ["top", "right", "bottom", "left"];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
const lrPlacement = ["left", "right"];
const rlPlacement = ["right", "left"];
const tbPlacement = ["top", "bottom"];
const btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case "left":
    case "right":
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const MAX_RESET_COUNT = 50;
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const platformWithDetectOverflow = platform2.detectOverflow ? platform2 : {
    ...platform2,
    detectOverflow
  };
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData[name] = {
      ...middlewareData[name],
      ...data
    };
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
const arrow$3 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides2 = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
const hide$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state) {
      const {
        rects,
        platform: platform2
      } = state;
      const {
        strategy = "referenceHidden",
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await platform2.detectOverflow(state, {
            ...detectOverflowOptions,
            elementContext: "reference"
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
        case "escaped": {
          const overflow = await platform2.detectOverflow(state, {
            ...detectOverflowOptions,
            altBoundary: true
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
        default: {
          return {};
        }
      }
    }
  };
};
const originSides = /* @__PURE__ */ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$2 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform: platform2
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
const limitShift$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset: offset2 = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset2, state);
      const computedOffset = typeof rawOffset === "number" ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === "y" ? "height" : "width";
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === "y" ? "width" : "height";
        const isOriginSide = originSides.has(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};
const size$2 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform: platform2,
        elements
      } = state;
      const {
        apply = () => {
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform2.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(":popover-open")) {
      return true;
    }
  } catch (_e) {
  }
  try {
    return element.matches(":modal");
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = (value) => !!value && value !== "none";
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = max(rect.top, top);
    right = min(rect.right, right);
    bottom = min(rect.bottom, bottom);
    left = max(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};
function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        refresh();
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    if (floating) {
      resizeObserver.observe(floating);
    }
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset$1 = offset$2;
const shift$1 = shift$2;
const flip$1 = flip$2;
const size$1 = size$2;
const hide$1 = hide$2;
const arrow$2 = arrow$3;
const limitShift$1 = limitShift$2;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
var isClient = typeof document !== "undefined";
var noop = function noop2() {
};
var index = isClient ? reactExports.useLayoutEffect : noop;
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === "function" && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === "object") {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0; ) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0; ) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0; ) {
      const key = keys[i];
      if (key === "_owner" && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}
function getDPR(element) {
  if (typeof window === "undefined") {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}
function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}
function useLatestRef(value) {
  const ref = reactExports.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = reactExports.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = reactExports.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = reactExports.useState(null);
  const [_floating, _setFloating] = reactExports.useState(null);
  const setReference = reactExports.useCallback((node) => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = reactExports.useCallback((node) => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = reactExports.useRef(null);
  const floatingRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform2);
  const openRef = useLatestRef(open);
  const update = reactExports.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    computePosition(referenceRef.current, floatingRef.current, config).then((data2) => {
      const fullData = {
        ...data2,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        reactDomExports.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data2) => ({
        ...data2,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = reactExports.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = reactExports.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = reactExports.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = reactExports.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...getDPR(elements.floating) >= 1.5 && {
          willChange: "transform"
        }
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return reactExports.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}
const arrow$1 = (options) => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, "current");
  }
  return {
    name: "arrow",
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === "function" ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return arrow$2({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return arrow$2({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};
const offset = (options, deps) => {
  const result = offset$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const shift = (options, deps) => {
  const result = shift$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const limitShift = (options, deps) => {
  const result = limitShift$1(options);
  return {
    fn: result.fn,
    options: [options, deps]
  };
};
const flip = (options, deps) => {
  const result = flip$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const size = (options, deps) => {
  const result = size$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const hide = (options, deps) => {
  const result = hide$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
const arrow = (options, deps) => {
  const result = arrow$1(options);
  return {
    name: result.name,
    fn: result.fn,
    options: [options, deps]
  };
};
var NAME$1 = "Arrow";
var Arrow$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.svg,
    {
      ...arrowProps,
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: props.asChild ? children : /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Arrow$1.displayName = NAME$1;
var Root$1 = Arrow$1;
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME = "PopperAnchor";
var PopperAnchor = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME, __scopePopper);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const anchorRef = reactExports.useRef(null);
    reactExports.useEffect(() => {
      const previousAnchor = anchorRef.current;
      anchorRef.current = (virtualRef == null ? void 0 : virtualRef.current) || ref.current;
      if (previousAnchor !== anchorRef.current) {
        context.onAnchorChange(anchorRef.current);
      }
    });
    return virtualRef ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...anchorProps, ref: composedRefs });
  }
);
PopperAnchor.displayName = ANCHOR_NAME;
var CONTENT_NAME$2 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$2);
var PopperContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    var _a, _b, _c, _d, _e, _f;
    const {
      __scopePopper,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;
    const context = usePopperContext(CONTENT_NAME$2, __scopePopper);
    const [content, setContent] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [arrow$12, setArrow] = reactExports.useState(null);
    const arrowSize = useSize(arrow$12);
    const arrowWidth = (arrowSize == null ? void 0 : arrowSize.width) ?? 0;
    const arrowHeight = (arrowSize == null ? void 0 : arrowSize.height) ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === "always"
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions && shift({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? limitShift() : void 0,
          ...detectOverflowOptions
        }),
        avoidCollisions && flip({ ...detectOverflowOptions }),
        size({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow$12 && arrow({ element: arrow$12, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
      ]
    });
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = useCallbackRef(onPlaced);
    useLayoutEffect2(() => {
      if (isPositioned) {
        handlePlaced == null ? void 0 : handlePlaced();
      }
    }, [isPositioned, handlePlaced]);
    const arrowX = (_a = middlewareData.arrow) == null ? void 0 : _a.x;
    const arrowY = (_b = middlewareData.arrow) == null ? void 0 : _b.y;
    const cannotCenterArrow = ((_c = middlewareData.arrow) == null ? void 0 : _c.centerOffset) !== 0;
    const [contentZIndex, setContentZIndex] = reactExports.useState();
    useLayoutEffect2(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: refs.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: contentZIndex,
          ["--radix-popper-transform-origin"]: [
            (_d = middlewareData.transformOrigin) == null ? void 0 : _d.x,
            (_e = middlewareData.transformOrigin) == null ? void 0 : _e.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((_f = middlewareData.hide) == null ? void 0 : _f.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: props.dir,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopperContentProvider,
          {
            scope: __scopePopper,
            placedSide,
            onArrowChange: setArrow,
            arrowX,
            arrowY,
            shouldHideArrow: cannotCenterArrow,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                "data-side": placedSide,
                "data-align": placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                  ...contentProps.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: !isPositioned ? "none" : void 0
                }
              }
            )
          }
        )
      }
    );
  }
);
PopperContent.displayName = CONTENT_NAME$2;
var ARROW_NAME$1 = "PopperArrow";
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow = reactExports.forwardRef(function PopperArrow2(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME$1, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root$1,
          {
            ...arrowProps,
            ref: forwardedRef,
            style: {
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
PopperArrow.displayName = ARROW_NAME$1;
function isNotNull(value) {
  return value !== null;
}
var transformOrigin = (options) => ({
  name: "transformOrigin",
  options,
  fn(data) {
    var _a, _b, _c;
    const { placement, rects, middlewareData } = data;
    const cannotCenterArrow = ((_a = middlewareData.arrow) == null ? void 0 : _a.centerOffset) !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
    const arrowXCenter = (((_b = middlewareData.arrow) == null ? void 0 : _b.x) ?? 0) + arrowWidth / 2;
    const arrowYCenter = (((_c = middlewareData.arrow) == null ? void 0 : _c.y) ?? 0) + arrowHeight / 2;
    let x = "";
    let y = "";
    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  }
});
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var Root2$2 = Popper;
var Anchor = PopperAnchor;
var Content$1 = PopperContent;
var Arrow = PopperArrow;
var VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...props,
        ref: forwardedRef,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;
var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(SELECT_NAME);
var [createSelectContext] = createContextScope(SELECT_NAME, [
  createCollectionScope$1,
  createPopperScope
]);
var usePopperScope = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select$1 = (props) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  const [trigger, setTrigger] = reactExports.useState(null);
  const [valueNode, setValueNode] = reactExports.useState(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = reactExports.useState(false);
  const direction = useDirection(dir);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: SELECT_NAME
  });
  const triggerPointerDownPosRef = reactExports.useRef(null);
  const isFormControl = trigger ? form || !!trigger.closest("form") : true;
  const [nativeOptionsSet, setNativeOptionsSet] = reactExports.useState(/* @__PURE__ */ new Set());
  const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectProvider,
    {
      required,
      scope: __scopeSelect,
      trigger,
      onTriggerChange: setTrigger,
      valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: useId(),
      value,
      onValueChange: setValue,
      open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef,
      disabled,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectNativeOptionsProvider,
          {
            scope: props.__scopeSelect,
            onNativeOptionAdd: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, []),
            onNativeOptionRemove: reactExports.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, []),
            children
          }
        ) }),
        isFormControl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectBubbleInput,
          {
            "aria-hidden": true,
            required,
            tabIndex: -1,
            name,
            autoComplete,
            value,
            onChange: (event) => setValue(event.target.value),
            disabled,
            form,
            children: [
              value === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "" }) : null,
              Array.from(nativeOptionsSet)
            ]
          },
          nativeSelectKey
        ) : null
      ]
    }
  ) });
};
Select$1.displayName = SELECT_NAME;
var TRIGGER_NAME$1 = "SelectTrigger";
var SelectTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME$1, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection$1(__scopeSelect);
    const pointerTypeRef = reactExports.useRef("touch");
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== void 0) {
        context.onValueChange(nextItem.value);
      }
    });
    const handleOpen = (pointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true);
        resetTypeahead();
      }
      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY)
        };
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": context.contentId,
        "aria-expanded": context.open,
        "aria-required": context.required,
        "aria-autocomplete": "none",
        dir: context.dir,
        "data-state": context.open ? "open" : "closed",
        disabled: isDisabled,
        "data-disabled": isDisabled ? "" : void 0,
        "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
        ...triggerProps,
        ref: composedRefs,
        onClick: composeEventHandlers(triggerProps.onClick, (event) => {
          event.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") {
            handleOpen(event);
          }
        }),
        onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
          pointerTypeRef.current = event.pointerType;
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
          if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
            handleOpen(event);
            event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== "";
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
          if (isTypingAhead && event.key === " ") return;
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
SelectTrigger$1.displayName = TRIGGER_NAME$1;
var VALUE_NAME = "SelectValue";
var SelectValue$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== void 0;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
    useLayoutEffect2(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...valueProps,
        ref: composedRefs,
        style: { pointerEvents: "none" },
        children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: placeholder }) : children
      }
    );
  }
);
SelectValue$1.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "▼" });
  }
);
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME = "SelectPortal";
var SelectPortal = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, ...props });
};
SelectPortal.displayName = PORTAL_NAME;
var CONTENT_NAME$1 = "SelectContent";
var SelectContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME$1, props.__scopeSelect);
    const [fragment, setFragment] = reactExports.useState();
    useLayoutEffect2(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? reactDomExports.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentProvider, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: props.children }) }) }),
        frag
      ) : null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentImpl, { ...props, ref: forwardedRef });
  }
);
SelectContent$1.displayName = CONTENT_NAME$1;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME$1);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot = createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      position = "item-aligned",
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME$1, __scopeSelect);
    const [content, setContent] = reactExports.useState(null);
    const [viewport, setViewport] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = reactExports.useState(null);
    const [selectedItemText, setSelectedItemText] = reactExports.useState(
      null
    );
    const getItems = useCollection$1(__scopeSelect);
    const [isPositioned, setIsPositioned] = reactExports.useState(false);
    const firstValidItemFoundRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);
    useFocusGuards();
    const focusFirst2 = reactExports.useCallback(
      (candidates) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);
        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate == null ? void 0 : candidate.scrollIntoView({ block: "nearest" });
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate == null ? void 0 : candidate.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );
    const focusSelectedItem = reactExports.useCallback(
      () => focusFirst2([selectedItem, content]),
      [focusFirst2, selectedItem, content]
    );
    reactExports.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);
    const { onOpenChange, triggerPointerDownPosRef } = context;
    reactExports.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event) => {
          var _a, _b;
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (((_a = triggerPointerDownPosRef.current) == null ? void 0 : _a.x) ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (((_b = triggerPointerDownPosRef.current) == null ? void 0 : _b.y) ?? 0))
          };
        };
        const handlePointerUp = (event) => {
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            if (!content.contains(event.target)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener("pointermove", handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }
        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    reactExports.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        setTimeout(() => nextItem.ref.current.focus());
      }
    });
    const itemRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = reactExports.useCallback(() => content == null ? void 0 : content.focus(), [content]);
    const itemTextRefCallback = reactExports.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );
    const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
    const popperContentProps = SelectPosition === SelectPopperPosition ? {
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions
    } : {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectContentProvider,
      {
        scope: __scopeSelect,
        content,
        viewport,
        onViewportChange: setViewport,
        itemRefCallback,
        selectedItem,
        onItemLeave: handleItemLeave,
        itemTextRefCallback,
        focusSelectedItem,
        selectedItemText,
        position,
        isPositioned,
        searchRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: context.open,
            onMountAutoFocus: (event) => {
              event.preventDefault();
            },
            onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
              var _a;
              (_a = context.trigger) == null ? void 0 : _a.focus({ preventScroll: true });
              event.preventDefault();
            }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside: (event) => event.preventDefault(),
                onDismiss: () => context.onOpenChange(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectPosition,
                  {
                    role: "listbox",
                    id: context.contentId,
                    "data-state": context.open ? "open" : "closed",
                    dir: context.dir,
                    onContextMenu: (event) => event.preventDefault(),
                    ...contentProps,
                    ...popperContentProps,
                    onPlaced: () => setIsPositioned(true),
                    ref: composedRefs,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...contentProps.style
                    },
                    onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (event.key === "Tab") event.preventDefault();
                      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                        const items = getItems().filter((item) => !item.disabled);
                        let candidateNodes = items.map((item) => item.ref.current);
                        if (["ArrowUp", "End"].includes(event.key)) {
                          candidateNodes = candidateNodes.slice().reverse();
                        }
                        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                          const currentElement = event.target;
                          const currentIndex = candidateNodes.indexOf(currentElement);
                          candidateNodes = candidateNodes.slice(currentIndex + 1);
                        }
                        setTimeout(() => focusFirst2(candidateNodes));
                        event.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME$1, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME$1, __scopeSelect);
  const [contentWrapper, setContentWrapper] = reactExports.useState(null);
  const [content, setContent] = reactExports.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection$1(__scopeSelect);
  const shouldExpandOnScrollRef = reactExports.useRef(false);
  const shouldRepositionRef = reactExports.useRef(true);
  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = reactExports.useCallback(() => {
    if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
      const triggerRect = context.trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();
      if (context.dir !== "rtl") {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp$1(left, [
          CONTENT_MARGIN,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.left = clampedLeft + "px";
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp$1(right, [
          CONTENT_MARGIN,
          Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.right = clampedRight + "px";
      }
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;
      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
      if (willAlignWithoutTopOverflow) {
        const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = "0px";
        const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + "px";
      } else {
        const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
        contentWrapper.style.top = "0px";
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + "px";
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }
      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + "px";
      contentWrapper.style.maxHeight = availableHeight + "px";
      onPlaced == null ? void 0 : onPlaced();
      requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced
  ]);
  useLayoutEffect2(() => position(), [position]);
  const [contentZIndex, setContentZIndex] = reactExports.useState();
  useLayoutEffect2(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);
  const handleScrollButtonChange = reactExports.useCallback(
    (node) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem == null ? void 0 : focusSelectedItem();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectViewportProvider,
    {
      scope: __scopeSelect,
      contentWrapper,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: setContentWrapper,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: contentZIndex
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              ...popperProps,
              ref: composedRefs,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...popperProps.style
              }
            }
          )
        }
      )
    }
  );
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeSelect,
    align = "start",
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope(__scopeSelect);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content$1,
    {
      ...popperScope,
      ...popperProps,
      ref: forwardedRef,
      align,
      collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width": "var(--radix-popper-available-width)",
          "--radix-select-content-available-height": "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME$1, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = reactExports.useRef(0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...viewportProps,
          ref: composedRefs,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...viewportProps.style
          },
          onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
            const viewport = event.currentTarget;
            const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
            if ((shouldExpandOnScrollRef == null ? void 0 : shouldExpandOnScrollRef.current) && contentWrapper) {
              const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
              if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                const cssHeight = parseFloat(contentWrapper.style.height);
                const prevHeight = Math.max(cssMinHeight, cssHeight);
                if (prevHeight < availableHeight) {
                  const nextHeight = prevHeight + scrolledBy;
                  const clampedNextHeight = Math.min(availableHeight, nextHeight);
                  const heightDiff = nextHeight - clampedNextHeight;
                  contentWrapper.style.height = clampedNextHeight + "px";
                  if (contentWrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    contentWrapper.style.justifyContent = "flex-end";
                  }
                }
              }
            }
            prevScrollTopRef.current = viewport.scrollTop;
          })
        }
      ) })
    ] });
  }
);
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME$1 = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME$1);
var SelectGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
  }
);
SelectGroup.displayName = GROUP_NAME$1;
var LABEL_NAME = "SelectLabel";
var SelectLabel = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
  }
);
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME$1 = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME$1);
var SelectItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME$1, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME$1, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = reactExports.useState(textValueProp ?? "");
    const [isFocused, setIsFocused] = reactExports.useState(false);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => {
        var _a;
        return (_a = contentContext.itemRefCallback) == null ? void 0 : _a.call(contentContext, node, value, disabled);
      }
    );
    const textId = useId();
    const pointerTypeRef = reactExports.useRef("touch");
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === "") {
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectItemContextProvider,
      {
        scope: __scopeSelect,
        value,
        disabled,
        textId,
        isSelected,
        onItemTextChange: reactExports.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || ((node == null ? void 0 : node.textContent) ?? "").trim());
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Collection$1.ItemSlot,
          {
            scope: __scopeSelect,
            value,
            disabled,
            textValue,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "option",
                "aria-labelledby": textId,
                "data-highlighted": isFocused ? "" : void 0,
                "aria-selected": isSelected && isFocused,
                "data-state": isSelected ? "checked" : "unchecked",
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                tabIndex: disabled ? void 0 : -1,
                ...itemProps,
                ref: composedRefs,
                onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                onClick: composeEventHandlers(itemProps.onClick, () => {
                  if (pointerTypeRef.current !== "mouse") handleSelect();
                }),
                onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                  if (pointerTypeRef.current === "mouse") handleSelect();
                }),
                onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                  pointerTypeRef.current = event.pointerType;
                }),
                onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                  var _a;
                  pointerTypeRef.current = event.pointerType;
                  if (disabled) {
                    (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
                  } else if (pointerTypeRef.current === "mouse") {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }),
                onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                  var _a;
                  if (event.currentTarget === document.activeElement) {
                    (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
                  }
                }),
                onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                  var _a;
                  const isTypingAhead = ((_a = contentContext.searchRef) == null ? void 0 : _a.current) !== "";
                  if (isTypingAhead && event.key === " ") return;
                  if (SELECTION_KEYS.includes(event.key)) handleSelect();
                  if (event.key === " ") event.preventDefault();
                })
              }
            )
          }
        )
      }
    );
  }
);
SelectItem$1.displayName = ITEM_NAME$1;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = reactExports.useState(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => {
        var _a;
        return (_a = contentContext.itemTextRefCallback) == null ? void 0 : _a.call(contentContext, node, itemContext.value, itemContext.disabled);
      }
    );
    const textContent = itemTextNode == null ? void 0 : itemTextNode.textContent;
    const nativeOption = reactExports.useMemo(
      () => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
      [itemContext.disabled, itemContext.value, textContent]
    );
    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect2(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? reactDomExports.createPortal(itemTextProps.children, context.valueNode) : null
    ] });
  }
);
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect);
    return itemContext.isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
  }
);
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton$1 = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const canScrollUp2 = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton$1 = reactExports.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = reactExports.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
  const autoScrollTimerRef = reactExports.useRef(null);
  const getItems = useCollection$1(__scopeSelect);
  const clearAutoScrollTimer = reactExports.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);
  reactExports.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);
  useLayoutEffect2(() => {
    var _a;
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    (_a = activeItem == null ? void 0 : activeItem.ref.current) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
  }, [getItems]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "aria-hidden": true,
      ...scrollIndicatorProps,
      ref: forwardedRef,
      style: { flexShrink: 0, ...scrollIndicatorProps.style },
      onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        var _a;
        (_a = contentContext.onItemLeave) == null ? void 0 : _a.call(contentContext);
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })
    }
  );
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
  }
);
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "SelectArrow";
var SelectArrow = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeSelect);
    const context = useSelectContext(ARROW_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
    return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
  }
);
SelectArrow.displayName = ARROW_NAME;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = reactExports.forwardRef(
  ({ __scopeSelect, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const select = ref.current;
      if (!select) return;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        "value"
      );
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("change", { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.select,
      {
        ...props,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
  return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
  const handleSearchChange = useCallbackRef(onSearchChange);
  const searchRef = reactExports.useRef("");
  const timerRef = reactExports.useRef(0);
  const handleTypeaheadSearch = reactExports.useCallback(
    (key) => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
    },
    [handleSearchChange]
  );
  const resetTypeahead = reactExports.useCallback(() => {
    searchRef.current = "";
    window.clearTimeout(timerRef.current);
  }, []);
  reactExports.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
  return [searchRef, handleTypeaheadSearch, resetTypeahead];
}
function findNextItem(items, search, currentItem) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray$1(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find(
    (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray$1(array, startIndex) {
  return array.map((_, index2) => array[(startIndex + index2) % array.length]);
}
var Root2$1 = Select$1;
var Trigger$1 = SelectTrigger$1;
var Value = SelectValue$1;
var Icon = SelectIcon;
var Portal = SelectPortal;
var Content2 = SelectContent$1;
var Viewport = SelectViewport;
var Item$1 = SelectItem$1;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton$1;
var ScrollDownButton = SelectScrollDownButton$1;
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$1, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size: size2 = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size2,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Item$1,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index2) => array[(startIndex + index2) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const MOVEMENT_SUBSTRATE_VERSION = "1.0.0";
const BODY_REGIONS = [
  "head_neck",
  "torso_spine",
  "left_arm",
  "right_arm",
  "left_hand",
  "right_hand",
  "pelvis_hips",
  "left_leg",
  "right_leg"
];
const JOINT_CLUSTERS = [
  "neck",
  "upper_spine",
  "lower_spine_pelvis",
  "left_shoulder",
  "right_shoulder",
  "left_elbow_forearm",
  "right_elbow_forearm",
  "left_wrist",
  "right_wrist",
  "left_hand_fingers",
  "right_hand_fingers",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle_foot",
  "right_ankle_foot"
];
const CLUSTER_TO_REGION = {
  neck: "head_neck",
  upper_spine: "torso_spine",
  lower_spine_pelvis: "pelvis_hips",
  left_shoulder: "left_arm",
  right_shoulder: "right_arm",
  left_elbow_forearm: "left_arm",
  right_elbow_forearm: "right_arm",
  left_wrist: "left_hand",
  right_wrist: "right_hand",
  left_hand_fingers: "left_hand",
  right_hand_fingers: "right_hand",
  left_hip: "pelvis_hips",
  right_hip: "pelvis_hips",
  left_knee: "left_leg",
  right_knee: "right_leg",
  left_ankle_foot: "left_leg",
  right_ankle_foot: "right_leg"
};
const PIPELINE_STEPS = [
  "body_state_ingest",
  "env_ingest",
  "strategic_ingest",
  "tactical_ingest",
  "main_brain_arbitration",
  "regional_decomposition",
  "cluster_execution",
  "reflex_interception",
  "output_ik",
  "telemetry_return"
];
const defaultRegionalValue = (val) => Object.fromEntries(BODY_REGIONS.map((r) => [r, val]));
function defaultTuning() {
  return {
    embodimentFidelity: 0.85,
    reflexSensitivity: 0.7,
    bodyPreservationWeight: 0.6,
    balancePriority: 0.75,
    smoothnessVsAggression: 0.35,
    recoveryAggressiveness: 0.5,
    terrainAdaptationWeight: 0.6,
    injuryCompensationScale: 0.7,
    contactConfidence: 0.8,
    regionalStiffness: defaultRegionalValue(0.55),
    regionalResponsiveness: defaultRegionalValue(0.65),
    stepFrequency: 0.5,
    strideLength: 0.5,
    hipSwing: 0.4,
    armSwing: 0.45
  };
}
function defaultJointSensor(clusterId) {
  return {
    clusterId,
    angle: 0,
    velocity: 0,
    load: 0.1,
    orientation: [0, 0, 0],
    stabilityScore: 0.9,
    fatigueAnalog: 0,
    damageAnalog: 0,
    slipRisk: 0,
    mobilityConstraint: 0
  };
}
function defaultBodyMesh() {
  return {
    joints: Object.fromEntries(
      JOINT_CLUSTERS.map((c) => [c, defaultJointSensor(c)])
    ),
    centerOfMassEstimate: [0, 1, 0],
    overallStabilityScore: 0.9,
    contactPoints: { left_ankle_foot: true, right_ankle_foot: true },
    terrainDifficultyEstimate: 0.1,
    motionSmoothnessScore: 0.85,
    proprioceptiveConfidence: 0.9,
    totalFatigueLoad: 0,
    totalDamageLoad: 0
  };
}
function initMovementSubstrate(tuning) {
  const t = { ...defaultTuning(), ...tuning };
  const emptyRegions = Object.fromEntries(
    BODY_REGIONS.map((r) => [
      r,
      {
        regionId: r,
        targetActivation: 0.1,
        currentActivation: 0.1,
        coordinationLoad: 0.1,
        neighborNegotiations: {},
        localStabilityScore: 0.9,
        postureContribution: 0.3,
        locomotionContribution: r.includes("leg") || r === "pelvis_hips" ? 0.6 : 0.1,
        manipulationContribution: r.includes("arm") || r.includes("hand") ? 0.4 : 0.05,
        reflexOverrideActive: false
      }
    ])
  );
  const emptyClusters = Object.fromEntries(
    JOINT_CLUSTERS.map((c) => [
      c,
      {
        clusterId: c,
        regionId: CLUSTER_TO_REGION[c],
        desiredActivation: 0.1,
        currentActivation: 0.1,
        stiffness: t.regionalStiffness[CLUSTER_TO_REGION[c]],
        damping: 0.5,
        contactAdaptation: 0.5,
        localStabilization: 0.9,
        smoothedOutput: 0.1,
        reflexOverride: false,
        loadBearing: c === "left_ankle_foot" || c === "right_ankle_foot"
      }
    ])
  );
  const pipelineStatus = Object.fromEntries(
    PIPELINE_STEPS.map((s) => [s, "ok"])
  );
  return {
    version: MOVEMENT_SUBSTRATE_VERSION,
    tickCount: 0,
    timestampMs: Date.now(),
    mainBrain: {
      movementMode: "idle",
      postureBias: "upright",
      speedEnvelope: 0,
      forceEnvelope: 0.2,
      contactPreference: 0.8,
      stabilityThreshold: 0.35,
      bodyPreservationBias: t.bodyPreservationWeight,
      coordinationPriority: "stability",
      perRegionTargets: defaultRegionalValue(0.1),
      strategicInfluence: 0,
      tacticalInfluence: 0,
      conflictResolutionLog: []
    },
    regions: emptyRegions,
    clusters: emptyClusters,
    reflexLayer: [],
    bodyMesh: defaultBodyMesh(),
    tuning: t,
    telemetry: {
      activeMovementMode: "idle",
      strategicInfluenceSummary: "No strategic input",
      tacticalInfluenceSummary: "No tactical input",
      stabilityScore: 0.9,
      bodyPreservationStatus: "nominal",
      movementSmoothness: 0.85,
      impairmentCompensation: 0,
      contactConfidence: 0.8,
      currentPostureBias: "upright",
      activeReflexCount: 0,
      highLoadClusters: [],
      regionPriorityMap: defaultRegionalValue(0.1),
      pipelineStepStatus: pipelineStatus
    }
  };
}
function deriveMovementMode(inputs, strategic, tactical, currentMode) {
  const fatigue = inputs.fatigueLoad;
  const urgency = inputs.amygdalaActivation;
  const drive = inputs.nacActivation;
  const stress = inputs.stressSignal;
  if (fatigue > 0.85 || inputs.recoverySignal > 0.8) return "recovery";
  if ((strategic == null ? void 0 : strategic.movementPriority) === "retreat" || ((tactical == null ? void 0 : tactical.suppressionLevel) ?? 0) > 0.8) {
    return stress > 0.6 ? "sprint" : "crouch";
  }
  if (tactical == null ? void 0 : tactical.contactEngaged) return "combat_stance";
  if (urgency > 0.75 && drive > 0.5) return stress > 0.5 ? "sprint" : "run";
  if (drive > 0.4 && fatigue < 0.5) return "walk";
  if ((strategic == null ? void 0 : strategic.movementPriority) === "hold")
    return currentMode === "prone" ? "prone" : "crouch";
  if (urgency < 0.2 && drive < 0.2) return "idle";
  return currentMode;
}
function derivePostureBias(inputs, tactical, mode) {
  if (mode === "prone") return "low_profile";
  if (mode === "recovery" || inputs.fatigueLoad > 0.7) return "exhausted";
  if (mode === "combat_stance" || (tactical == null ? void 0 : tactical.contactEngaged))
    return "combat_ready";
  if (((tactical == null ? void 0 : tactical.coverOpportunity) ?? 0) > 0.6) return "defensive";
  if (mode === "sprint") return "forward_lean";
  return "upright";
}
function tickMainBrain(prev, neural, strategic, tactical, tuning, mesh) {
  const mode = deriveMovementMode(
    neural,
    strategic,
    tactical,
    prev.movementMode
  );
  const posture = derivePostureBias(neural, tactical, mode);
  const strategicInfluence = strategic ? Math.min(
    1,
    strategic.speedBias * 0.4 + strategic.aggressionBias * 0.3 + strategic.cautionBias * 0.3
  ) : 0;
  const tacticalInfluence = tactical ? Math.min(
    1,
    tactical.urgencyMultiplier * 0.5 + tactical.immediateThreats * 0.5
  ) : 0;
  const speedEnvelope = Math.max(
    0,
    Math.min(
      1,
      neural.nacActivation * 0.4 + ((strategic == null ? void 0 : strategic.speedBias) ?? 0) * 0.3 + ((tactical == null ? void 0 : tactical.urgencyMultiplier) ?? 0) * 0.3 - neural.fatigueLoad * 0.5 + tuning.smoothnessVsAggression * 0.1
    )
  );
  const forceEnvelope = Math.max(
    0.1,
    Math.min(
      1,
      neural.amygdalaActivation * 0.4 + ((strategic == null ? void 0 : strategic.aggressionBias) ?? 0) * 0.3 + (1 - neural.fatigueLoad) * 0.3
    )
  );
  const targets = {
    head_neck: mode === "idle" ? 0.1 : mode === "combat_stance" ? 0.7 : 0.4,
    torso_spine: ["sprint", "run"].includes(mode) ? 0.75 : mode === "idle" ? 0.15 : 0.5,
    left_arm: mode === "combat_stance" ? 0.65 : ["sprint", "run"].includes(mode) ? 0.55 : 0.25,
    right_arm: mode === "combat_stance" ? 0.65 : ["sprint", "run"].includes(mode) ? 0.55 : 0.25,
    left_hand: mode === "combat_stance" ? 0.7 : 0.2,
    right_hand: mode === "combat_stance" ? 0.7 : 0.2,
    pelvis_hips: ["sprint", "run", "walk"].includes(mode) ? 0.8 : mode === "idle" ? 0.2 : 0.5,
    left_leg: ["sprint", "run", "walk"].includes(mode) ? 0.85 : mode === "crouch" ? 0.6 : 0.2,
    right_leg: ["sprint", "run", "walk"].includes(mode) ? 0.85 : mode === "crouch" ? 0.6 : 0.2
  };
  for (const r of BODY_REGIONS) {
    const regionDamage = JOINT_CLUSTERS.filter((c) => CLUSTER_TO_REGION[c] === r).reduce(
      (sum, c) => {
        var _a;
        return sum + (((_a = mesh.joints[c]) == null ? void 0 : _a.damageAnalog) ?? 0);
      },
      0
    ) / 3;
    if (regionDamage > 0.3) {
      targets[r] = Math.max(
        0.1,
        targets[r] * (1 - regionDamage * tuning.bodyPreservationWeight)
      );
    }
  }
  const conflictLog = [];
  if (strategicInfluence > 0.5 && tacticalInfluence > 0.5) {
    conflictLog.push(
      `Conflict: tactical urgency (${tacticalInfluence.toFixed(2)}) vs strategic bias (${strategicInfluence.toFixed(2)}) — tactical wins`
    );
  }
  return {
    movementMode: mode,
    postureBias: posture,
    speedEnvelope,
    forceEnvelope,
    contactPreference: Math.min(
      1,
      mesh.overallStabilityScore + tuning.balancePriority * 0.3
    ),
    stabilityThreshold: 0.25 + (1 - tuning.balancePriority) * 0.3,
    bodyPreservationBias: tuning.bodyPreservationWeight,
    coordinationPriority: neural.fatigueLoad > 0.7 ? "recovery" : neural.stressSignal > 0.7 ? "speed" : mode === "combat_stance" ? "stability" : "stability",
    perRegionTargets: targets,
    strategicInfluence,
    tacticalInfluence,
    conflictResolutionLog: conflictLog.slice(-5)
  };
}
function tickRegionalBrains(prevRegions, mainBrain, mesh, tuning, activeReflexes) {
  const result = { ...prevRegions };
  const alpha = tuning.regionalResponsiveness;
  for (const r of BODY_REGIONS) {
    const prev = prevRegions[r];
    const target = mainBrain.perRegionTargets[r];
    const resp = alpha[r];
    const current = prev.currentActivation + (target - prev.currentActivation) * resp * 0.15;
    const regionClusters = JOINT_CLUSTERS.filter(
      (c) => CLUSTER_TO_REGION[c] === r
    );
    const localStability = regionClusters.reduce(
      (sum, c) => {
        var _a;
        return sum + (((_a = mesh.joints[c]) == null ? void 0 : _a.stabilityScore) ?? 0.9);
      },
      0
    ) / Math.max(1, regionClusters.length);
    const reflexActive = activeReflexes.some((re) => re.regionId === r);
    result[r] = {
      ...prev,
      targetActivation: target,
      currentActivation: Math.max(0, Math.min(1, current)),
      coordinationLoad: Math.abs(target - prev.currentActivation),
      localStabilityScore: localStability,
      postureContribution: r === "torso_spine" || r === "pelvis_hips" ? current * 0.7 : current * 0.3,
      locomotionContribution: ["left_leg", "right_leg", "pelvis_hips"].includes(
        r
      ) ? current * 0.85 : current * 0.1,
      manipulationContribution: [
        "left_arm",
        "right_arm",
        "left_hand",
        "right_hand"
      ].includes(r) ? current * 0.75 : 0,
      reflexOverrideActive: reflexActive
    };
  }
  return result;
}
function tickClusters(prevClusters, regions, mesh, tuning, activeReflexes) {
  const result = { ...prevClusters };
  for (const c of JOINT_CLUSTERS) {
    const prev = prevClusters[c];
    const region = regions[CLUSTER_TO_REGION[c]];
    const sensor = mesh.joints[c];
    const reflexOverride = activeReflexes.find((re) => re.clusterId === c);
    const desired = reflexOverride ? Math.min(1, region.currentActivation + reflexOverride.intensity * 0.4) : region.currentActivation;
    const stiffness = tuning.regionalStiffness[CLUSTER_TO_REGION[c]];
    const damping = 0.4 + (1 - tuning.smoothnessVsAggression) * 0.3;
    const error = desired - prev.currentActivation;
    const current = prev.currentActivation + error * stiffness * 0.2 - prev.currentActivation * (1 - damping) * 0.02;
    const isContact = mesh.contactPoints[c] === true;
    const contactAdaptation = isContact ? Math.min(1, prev.contactAdaptation + 0.05) : Math.max(0, prev.contactAdaptation - 0.03);
    const localStabilization = Math.min(
      1,
      prev.localStabilization + sensor.slipRisk * 0.1 - 0.02
    );
    const smoothedOutput = prev.smoothedOutput * 0.75 + Math.max(0, Math.min(1, current)) * 0.25;
    result[c] = {
      ...prev,
      desiredActivation: desired,
      currentActivation: Math.max(0, Math.min(1, current)),
      stiffness,
      damping,
      contactAdaptation,
      localStabilization: Math.max(0, Math.min(1, localStabilization)),
      smoothedOutput,
      reflexOverride: !!reflexOverride,
      loadBearing: isContact || c === "left_ankle_foot" || c === "right_ankle_foot" || c === "lower_spine_pelvis"
    };
  }
  return result;
}
function tickReflexLayer(prevReflexes, mesh, mainBrain, tuning, _tick) {
  var _a, _b, _c, _d;
  const aged = prevReflexes.map((r) => ({ ...r, remainingTicks: r.remainingTicks - 1 })).filter((r) => r.remainingTicks > 0);
  const newReflexes = [...aged];
  const sensitivity = tuning.reflexSensitivity;
  const now = Date.now();
  const alreadyActive = (t) => aged.some((r) => r.reflexType === t);
  const ankleSlip = Math.max(
    ((_a = mesh.joints.left_ankle_foot) == null ? void 0 : _a.slipRisk) ?? 0,
    ((_b = mesh.joints.right_ankle_foot) == null ? void 0 : _b.slipRisk) ?? 0
  );
  if (ankleSlip > 0.5 * sensitivity && !alreadyActive("slip_correction")) {
    newReflexes.push({
      reflexType: "slip_correction",
      clusterId: ankleSlip > 0.6 ? "left_ankle_foot" : "right_ankle_foot",
      regionId: "left_leg",
      activationReason: `Ankle slip risk ${ankleSlip.toFixed(2)}`,
      intensity: ankleSlip,
      remainingTicks: 8,
      startedAt: now
    });
  }
  if (mesh.overallStabilityScore < mainBrain.stabilityThreshold && !alreadyActive("balance_rescue")) {
    newReflexes.push({
      reflexType: "balance_rescue",
      clusterId: "lower_spine_pelvis",
      regionId: "pelvis_hips",
      activationReason: `Stability ${mesh.overallStabilityScore.toFixed(2)} < threshold ${mainBrain.stabilityThreshold.toFixed(2)}`,
      intensity: 1 - mesh.overallStabilityScore,
      remainingTicks: 12,
      startedAt: now
    });
  }
  for (const c of JOINT_CLUSTERS) {
    if (((_c = mesh.joints[c]) == null ? void 0 : _c.load) > 0.85 && !alreadyActive("joint_overload_reduction")) {
      newReflexes.push({
        reflexType: "joint_overload_reduction",
        clusterId: c,
        regionId: CLUSTER_TO_REGION[c],
        activationReason: `Joint ${c} load ${mesh.joints[c].load.toFixed(2)}`,
        intensity: mesh.joints[c].load - 0.8,
        remainingTicks: 6,
        startedAt: now
      });
    }
  }
  if ((((_d = mesh.joints.upper_spine) == null ? void 0 : _d.stabilityScore) ?? 1) < 0.4 && !alreadyActive("posture_rescue")) {
    newReflexes.push({
      reflexType: "posture_rescue",
      clusterId: "upper_spine",
      regionId: "torso_spine",
      activationReason: "Upper spine destabilizing",
      intensity: 0.7,
      remainingTicks: 10,
      startedAt: now
    });
  }
  if (mesh.terrainDifficultyEstimate > 0.6 * sensitivity && !alreadyActive("terrain_adaptation_snap")) {
    newReflexes.push({
      reflexType: "terrain_adaptation_snap",
      clusterId: "left_ankle_foot",
      regionId: "left_leg",
      activationReason: `Terrain difficulty ${mesh.terrainDifficultyEstimate.toFixed(2)}`,
      intensity: mesh.terrainDifficultyEstimate * 0.6,
      remainingTicks: 5,
      startedAt: now
    });
  }
  if (mesh.proprioceptiveConfidence < 0.5 && !alreadyActive("foot_placement_correction")) {
    newReflexes.push({
      reflexType: "foot_placement_correction",
      clusterId: "right_ankle_foot",
      regionId: "right_leg",
      activationReason: `Proprioceptive confidence ${mesh.proprioceptiveConfidence.toFixed(2)}`,
      intensity: 1 - mesh.proprioceptiveConfidence,
      remainingTicks: 7,
      startedAt: now
    });
  }
  return newReflexes.slice(-10);
}
function tickBodyMesh(prev, neural, clusters, tuning) {
  const updatedJoints = { ...prev.joints };
  for (const c of JOINT_CLUSTERS) {
    const cluster = clusters[c];
    const prevJoint = prev.joints[c];
    const fatigueAnalog = Math.min(
      1,
      prevJoint.fatigueAnalog * 0.98 + neural.fatigueLoad * 0.02
    );
    const slipRisk = Math.max(
      0,
      prevJoint.slipRisk + prev.terrainDifficultyEstimate * 0.05 - 0.03
    );
    const load = Math.min(
      1,
      cluster.smoothedOutput * 0.7 + prevJoint.load * 0.3
    );
    const angle = Math.sin(Date.now() * 1e-3 + c.length * 0.3) * cluster.smoothedOutput * 0.5;
    const velocity = Math.abs(cluster.currentActivation - cluster.desiredActivation) * 2;
    const stabilityScore = Math.max(
      0.1,
      1 - slipRisk * 0.4 - fatigueAnalog * 0.2 - load * 0.1
    );
    updatedJoints[c] = {
      ...prevJoint,
      angle,
      velocity,
      load,
      fatigueAnalog,
      slipRisk: Math.min(1, slipRisk),
      stabilityScore,
      mobilityConstraint: Math.max(
        0,
        prevJoint.damageAnalog * tuning.injuryCompensationScale * 0.8
      )
    };
  }
  const overallStability = Object.values(updatedJoints).reduce((s, j) => s + j.stabilityScore, 0) / JOINT_CLUSTERS.length;
  const totalFatigue = Object.values(updatedJoints).reduce((s, j) => s + j.fatigueAnalog, 0) / JOINT_CLUSTERS.length;
  const smoothness = 1 - Object.values(updatedJoints).reduce((s, j) => s + j.velocity, 0) / JOINT_CLUSTERS.length / 2;
  const propConf = Math.max(
    0.2,
    Math.min(1, overallStability * 0.8 + (1 - totalFatigue) * 0.2)
  );
  return {
    ...prev,
    joints: updatedJoints,
    overallStabilityScore: overallStability,
    motionSmoothnessScore: Math.max(0, Math.min(1, smoothness)),
    proprioceptiveConfidence: propConf,
    totalFatigueLoad: totalFatigue,
    terrainDifficultyEstimate: Math.max(
      0,
      prev.terrainDifficultyEstimate + (Math.random() - 0.5) * 0.02
    )
  };
}
function buildTelemetry(mainBrain, mesh, reflexes, clusters, strategic, tactical) {
  const highLoad = JOINT_CLUSTERS.filter(
    (c) => clusters[c].smoothedOutput > 0.75
  );
  const regionPriority = Object.fromEntries(
    BODY_REGIONS.map((r) => [r, mainBrain.perRegionTargets[r]])
  );
  const pipelineStatus = Object.fromEntries(
    [
      "body_state_ingest",
      "env_ingest",
      "strategic_ingest",
      "tactical_ingest",
      "main_brain_arbitration",
      "regional_decomposition",
      "cluster_execution",
      "reflex_interception",
      "output_ik",
      "telemetry_return"
    ].map((s) => [
      s,
      s === "strategic_ingest" && !strategic ? "skip" : s === "tactical_ingest" && !tactical ? "skip" : mesh.overallStabilityScore < 0.3 && s === "output_ik" ? "warn" : "ok"
    ])
  );
  const bodyPreservation = mesh.totalDamageLoad > 0.5 ? "critical" : mesh.totalDamageLoad > 0.2 ? "compensating" : "nominal";
  return {
    activeMovementMode: mainBrain.movementMode,
    strategicInfluenceSummary: strategic ? `WarCommand: ${strategic.movementPriority} | speed ${strategic.speedBias.toFixed(2)} | stealth ${strategic.stealthBias.toFixed(2)}` : "No strategic input",
    tacticalInfluenceSummary: tactical ? `BattleOps: threats ${tactical.immediateThreats.toFixed(2)} | suppression ${tactical.suppressionLevel.toFixed(2)} | contact ${tactical.contactEngaged}` : "No tactical input",
    stabilityScore: mesh.overallStabilityScore,
    bodyPreservationStatus: bodyPreservation,
    movementSmoothness: mesh.motionSmoothnessScore,
    impairmentCompensation: mesh.totalDamageLoad,
    contactConfidence: mesh.proprioceptiveConfidence,
    currentPostureBias: mainBrain.postureBias,
    activeReflexCount: reflexes.length,
    highLoadClusters: highLoad,
    regionPriorityMap: regionPriority,
    pipelineStepStatus: pipelineStatus
  };
}
function tickMovementSubstrate(prev, neural, strategic, tactical, tuningOverride) {
  const tuning = tuningOverride ? { ...prev.tuning, ...tuningOverride } : prev.tuning;
  const tick = prev.tickCount + 1;
  const mesh = tickBodyMesh(prev.bodyMesh, neural, prev.clusters, tuning);
  const mainBrain = tickMainBrain(
    prev.mainBrain,
    neural,
    strategic,
    tactical,
    tuning,
    mesh
  );
  const regions = tickRegionalBrains(
    prev.regions,
    mainBrain,
    mesh,
    tuning,
    prev.reflexLayer
  );
  const clusters = tickClusters(
    prev.clusters,
    regions,
    mesh,
    tuning,
    prev.reflexLayer
  );
  const reflexLayer = tickReflexLayer(
    prev.reflexLayer,
    mesh,
    mainBrain,
    tuning
  );
  const telemetry = buildTelemetry(
    mainBrain,
    mesh,
    reflexLayer,
    clusters,
    strategic,
    tactical
  );
  return {
    ...prev,
    tickCount: tick,
    timestampMs: Date.now(),
    mainBrain,
    regions,
    clusters,
    reflexLayer,
    bodyMesh: mesh,
    tuning,
    telemetry
  };
}
const TICK_INTERVAL_MS = 33;
function useMovementSubstrate() {
  const [state, setState] = reactExports.useState(
    () => initMovementSubstrate()
  );
  const stateRef = reactExports.useRef(state);
  stateRef.current = state;
  const strategicRef = reactExports.useRef(null);
  const tacticalRef = reactExports.useRef(null);
  const tuningOverrideRef = reactExports.useRef({});
  const runningRef = reactExports.useRef(false);
  const setStrategicIntent = reactExports.useCallback(
    (intent) => {
      strategicRef.current = intent;
      if (typeof liveBrainBus.setStrategicMovementIntent === "function") {
        liveBrainBus.setStrategicMovementIntent(intent);
      }
    },
    []
  );
  const setTacticalContext = reactExports.useCallback(
    (ctx) => {
      tacticalRef.current = ctx;
      if (typeof liveBrainBus.setTacticalMovementContext === "function") {
        liveBrainBus.setTacticalMovementContext(ctx);
      }
    },
    []
  );
  const applyTuning = reactExports.useCallback(
    (tuning) => {
      tuningOverrideRef.current = { ...tuningOverrideRef.current, ...tuning };
    },
    []
  );
  const start = reactExports.useCallback(() => {
    runningRef.current = true;
  }, []);
  const stop = reactExports.useCallback(() => {
    runningRef.current = false;
  }, []);
  const reset = reactExports.useCallback(() => {
    setState(initMovementSubstrate());
  }, []);
  reactExports.useEffect(() => {
    runningRef.current = true;
    const interval = setInterval(() => {
      if (!runningRef.current) return;
      const bus = liveBrainBus;
      const lastPacket = bus._lastPacket ?? {};
      const neural = {
        pfcActivation: lastPacket.pfc_activation ?? Math.random() * 0.3 + 0.4,
        amygdalaActivation: lastPacket.amygdala_activation ?? Math.random() * 0.2 + 0.2,
        nacActivation: lastPacket.nac_activation ?? Math.random() * 0.3 + 0.3,
        hippocampusActivation: lastPacket.hippocampus_activation ?? Math.random() * 0.2 + 0.3,
        fatigueLoad: lastPacket.fatigue ?? Math.random() * 0.15,
        arousaLevel: lastPacket.arousal ?? Math.random() * 0.3 + 0.3,
        stressSignal: lastPacket.stress ?? Math.random() * 0.2,
        recoverySignal: lastPacket.recovery ?? Math.random() * 0.1
      };
      const next = tickMovementSubstrate(
        stateRef.current,
        neural,
        strategicRef.current,
        tacticalRef.current,
        Object.keys(tuningOverrideRef.current).length > 0 ? tuningOverrideRef.current : void 0
      );
      setState(next);
    }, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
  return {
    state,
    setStrategicIntent,
    setTacticalContext,
    applyTuning,
    start,
    stop,
    reset
  };
}
function activationColor(v) {
  const clamped = Math.max(0, Math.min(1, v));
  if (clamped < 0.33) {
    const t2 = clamped / 0.33;
    const l2 = 0.28 + t2 * 0.08;
    const c2 = 0.04 + t2 * 0.06;
    return `oklch(${l2} ${c2} 220)`;
  }
  if (clamped < 0.66) {
    const t2 = (clamped - 0.33) / 0.33;
    const l2 = 0.36 + t2 * 0.2;
    const c2 = 0.1 + t2 * 0.12;
    const h2 = 220 - t2 * 175;
    return `oklch(${l2} ${c2} ${h2})`;
  }
  const t = (clamped - 0.66) / 0.34;
  const l = 0.56 + t * 0.05;
  const c = 0.22 + t * 0.08;
  const h = 45 - t * 20;
  return `oklch(${l} ${c} ${h})`;
}
function activationBg(v, alpha = 1) {
  const color = activationColor(v);
  const m = color.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);
  if (!m) return color;
  return `oklch(${m[1]} ${m[2]} ${m[3]} / ${alpha})`;
}
function pipelineColor(status) {
  if (status === "ok") return "oklch(0.72 0.18 145)";
  if (status === "warn") return "oklch(0.75 0.22 85)";
  return "oklch(0.45 0.03 220)";
}
function modeColor(mode) {
  const map = {
    idle: "oklch(0.55 0.05 220)",
    walk: "oklch(0.72 0.15 145)",
    run: "oklch(0.72 0.22 165)",
    sprint: "oklch(0.75 0.25 155)",
    crouch: "oklch(0.68 0.18 200)",
    prone: "oklch(0.62 0.14 210)",
    climb: "oklch(0.70 0.20 80)",
    swim: "oklch(0.68 0.18 225)",
    combat_stance: "oklch(0.70 0.26 35)",
    carry: "oklch(0.68 0.16 55)",
    recovery: "oklch(0.68 0.20 310)"
  };
  return map[mode] ?? "oklch(0.55 0.05 220)";
}
const REGION_LABELS = {
  head_neck: "HEAD / NECK",
  torso_spine: "TORSO / SPINE",
  left_arm: "LEFT ARM",
  right_arm: "RIGHT ARM",
  left_hand: "LEFT HAND",
  right_hand: "RIGHT HAND",
  pelvis_hips: "PELVIS / HIPS",
  left_leg: "LEFT LEG",
  right_leg: "RIGHT LEG"
};
const CLUSTER_LABELS = {
  neck: "Neck",
  upper_spine: "Upper Spine",
  lower_spine_pelvis: "L-Spine / Pelvis",
  left_shoulder: "L Shoulder",
  right_shoulder: "R Shoulder",
  left_elbow_forearm: "L Elbow",
  right_elbow_forearm: "R Elbow",
  left_wrist: "L Wrist",
  right_wrist: "R Wrist",
  left_hand_fingers: "L Hand",
  right_hand_fingers: "R Hand",
  left_hip: "L Hip",
  right_hip: "R Hip",
  left_knee: "L Knee",
  right_knee: "R Knee",
  left_ankle_foot: "L Ankle",
  right_ankle_foot: "R Ankle"
};
const PIPELINE_LABELS = {
  body_state_ingest: "BODY",
  env_ingest: "ENV",
  strategic_ingest: "STRAT",
  tactical_ingest: "TACT",
  main_brain_arbitration: "ARB",
  regional_decomposition: "REGION",
  cluster_execution: "CLUSTER",
  reflex_interception: "REFLEX",
  output_ik: "IK",
  telemetry_return: "TELEM"
};
const BODY_SVG_REGIONS = [
  { id: "head_neck", label: "HEAD", x: 70, y: 8, w: 60, h: 52, rx: 28 },
  { id: "torso_spine", label: "TORSO", x: 52, y: 68, w: 96, h: 90, rx: 6 },
  { id: "left_arm", label: "L ARM", x: 8, y: 68, w: 38, h: 72, rx: 10 },
  { id: "right_arm", label: "R ARM", x: 154, y: 68, w: 38, h: 72, rx: 10 },
  { id: "left_hand", label: "L HAND", x: 4, y: 144, w: 34, h: 32, rx: 8 },
  { id: "right_hand", label: "R HAND", x: 162, y: 144, w: 34, h: 32, rx: 8 },
  { id: "pelvis_hips", label: "HIPS", x: 54, y: 162, w: 92, h: 40, rx: 6 },
  { id: "left_leg", label: "L LEG", x: 52, y: 206, w: 44, h: 110, rx: 8 },
  { id: "right_leg", label: "R LEG", x: 104, y: 206, w: 44, h: 110, rx: 8 }
];
function BodyMapSVG({
  regions,
  selectedRegion,
  onSelectRegion
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 200 330",
      width: "200",
      height: "330",
      role: "img",
      "aria-label": "Body activation map showing regional states",
      style: { display: "block", margin: "0 auto" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "100",
            cy: "34",
            rx: "34",
            ry: "30",
            fill: "none",
            stroke: "oklch(0.35 0.04 220)",
            strokeWidth: "0.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "52",
            y: "68",
            width: "96",
            height: "90",
            rx: "6",
            fill: "none",
            stroke: "oklch(0.35 0.04 220)",
            strokeWidth: "0.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "100",
            y1: "158",
            x2: "100",
            y2: "202",
            stroke: "oklch(0.35 0.04 220)",
            strokeWidth: "0.5"
          }
        ),
        BODY_SVG_REGIONS.map((r) => {
          var _a, _b;
          const activation = ((_a = regions[r.id]) == null ? void 0 : _a.currentActivation) ?? 0;
          const isSelected = selectedRegion === r.id;
          const reflexActive = ((_b = regions[r.id]) == null ? void 0 : _b.reflexOverrideActive) ?? false;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "g",
            {
              onClick: () => onSelectRegion(r.id),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") onSelectRegion(r.id);
              },
              tabIndex: 0,
              style: { cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "rect",
                  {
                    x: r.x,
                    y: r.y,
                    width: r.w,
                    height: r.h,
                    rx: r.rx ?? 4,
                    fill: activationBg(activation, 0.72),
                    stroke: isSelected ? "oklch(0.85 0.25 200)" : reflexActive ? "oklch(0.75 0.28 60)" : "oklch(0.32 0.04 220)",
                    strokeWidth: isSelected ? 2.5 : reflexActive ? 1.5 : 1,
                    style: {
                      filter: isSelected ? "drop-shadow(0 0 4px oklch(0.85 0.25 200 / 0.6))" : "none",
                      transition: "fill 0.15s ease"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "text",
                  {
                    x: r.x + r.w / 2,
                    y: r.y + r.h / 2 + 4,
                    textAnchor: "middle",
                    fontSize: "6.5",
                    fontFamily: "JetBrains Mono, monospace",
                    fill: "oklch(0.85 0.04 220)",
                    fontWeight: "600",
                    letterSpacing: "0.5",
                    style: { pointerEvents: "none" },
                    children: r.label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "text",
                  {
                    x: r.x + r.w / 2,
                    y: r.y + r.h / 2 + 13,
                    textAnchor: "middle",
                    fontSize: "5.5",
                    fontFamily: "JetBrains Mono, monospace",
                    fill: activationColor(activation),
                    style: { pointerEvents: "none" },
                    children: [
                      (activation * 100).toFixed(0),
                      "%"
                    ]
                  }
                ),
                reflexActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: r.x + r.w - 6,
                    cy: r.y + 6,
                    r: 4,
                    fill: "oklch(0.75 0.28 60 / 0.9)",
                    style: { animation: "pulse 1s ease-in-out infinite" }
                  }
                )
              ]
            },
            r.id
          );
        })
      ]
    }
  );
}
function MiniBar({
  value,
  color,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        style: {
          color: "oklch(0.5 0.04 220)",
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 52,
          flexShrink: 0
        },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          flex: 1,
          height: 4,
          background: "oklch(0.22 0.03 220)",
          borderRadius: 2,
          overflow: "hidden"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: `${Math.max(0, Math.min(100, value * 100))}%`,
              height: "100%",
              background: color,
              transition: "width 0.12s ease",
              borderRadius: 2
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          color: "oklch(0.6 0.05 220)",
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 28,
          textAlign: "right"
        },
        children: [
          (value * 100).toFixed(0),
          "%"
        ]
      }
    )
  ] });
}
function ActivationBar({ value, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        style: {
          color: "oklch(0.5 0.04 220)",
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 44,
          flexShrink: 0
        },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          flex: 1,
          height: 5,
          background: "oklch(0.18 0.03 220)",
          borderRadius: 2,
          overflow: "hidden"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: `${Math.max(0, Math.min(100, value * 100))}%`,
              height: "100%",
              background: activationColor(value),
              transition: "width 0.12s ease",
              borderRadius: 2
            }
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          color: activationColor(value),
          fontSize: "9px",
          fontFamily: "JetBrains Mono, monospace",
          width: 28,
          textAlign: "right"
        },
        children: [
          (value * 100).toFixed(0),
          "%"
        ]
      }
    )
  ] });
}
function TuningSlider({
  label,
  value,
  onChange,
  min: min2 = 0,
  max: max2 = 1,
  step = 0.01,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          style: {
            color: "oklch(0.6 0.05 220)",
            fontSize: "10px",
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: "0.03em"
          },
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          style: {
            color: "oklch(0.75 0.15 200)",
            fontSize: "10px",
            fontFamily: "JetBrains Mono, monospace"
          },
          children: value.toFixed(2)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Slider,
      {
        value: [value],
        min: min2,
        max: max2,
        step,
        onValueChange: ([v]) => onChange(v),
        "data-ocid": ocid,
        className: "mt-0.5"
      }
    )
  ] });
}
function AvatarTab() {
  const { state, setStrategicIntent, setTacticalContext, applyTuning } = useMovementSubstrate();
  const [selectedRegion, setSelectedRegion] = reactExports.useState(
    null
  );
  const [clustersExpanded, setClustersExpanded] = reactExports.useState(false);
  const [tuning, setTuning] = reactExports.useState(
    () => state.tuning
  );
  const handleTuning = reactExports.useCallback(
    (key, value) => {
      setTuning((prev) => {
        const next = { ...prev, [key]: value };
        applyTuning({ [key]: value });
        return next;
      });
    },
    [applyTuning]
  );
  const handleRegionalTuning = reactExports.useCallback(
    (type, region, value) => {
      setTuning((prev) => {
        const next = {
          ...prev,
          [type]: { ...prev[type], [region]: value }
        };
        applyTuning({ [type]: next[type] });
        return next;
      });
    },
    [applyTuning]
  );
  const applyPreset = reactExports.useCallback(
    (preset) => {
      const presets = {
        combat: {
          embodimentFidelity: 0.9,
          reflexSensitivity: 0.9,
          bodyPreservationWeight: 0.4,
          balancePriority: 0.8,
          smoothnessVsAggression: 0.8,
          recoveryAggressiveness: 0.7,
          stepFrequency: 0.75,
          strideLength: 0.7
        },
        stealth: {
          embodimentFidelity: 0.8,
          reflexSensitivity: 0.6,
          bodyPreservationWeight: 0.7,
          balancePriority: 0.9,
          smoothnessVsAggression: 0.1,
          recoveryAggressiveness: 0.3,
          stepFrequency: 0.3,
          strideLength: 0.35,
          hipSwing: 0.15,
          armSwing: 0.1
        },
        recovery: {
          embodimentFidelity: 0.7,
          reflexSensitivity: 0.8,
          bodyPreservationWeight: 0.95,
          balancePriority: 0.95,
          smoothnessVsAggression: 0.05,
          recoveryAggressiveness: 0.9,
          injuryCompensationScale: 0.9,
          stepFrequency: 0.25,
          strideLength: 0.25
        },
        baseline: {
          embodimentFidelity: 0.85,
          reflexSensitivity: 0.7,
          bodyPreservationWeight: 0.6,
          balancePriority: 0.75,
          smoothnessVsAggression: 0.35,
          recoveryAggressiveness: 0.5,
          terrainAdaptationWeight: 0.6,
          injuryCompensationScale: 0.7,
          contactConfidence: 0.8,
          stepFrequency: 0.5,
          strideLength: 0.5,
          hipSwing: 0.4,
          armSwing: 0.45
        }
      };
      const p = presets[preset];
      setTuning((prev) => ({ ...prev, ...p }));
      applyTuning(p);
    },
    [applyTuning]
  );
  const [stratPriority, setStratPriority] = reactExports.useState("none");
  const [stratSpeed, setStratSpeed] = reactExports.useState(0.5);
  const [stratStealth, setStratStealth] = reactExports.useState(0.2);
  const [stratAggression, setStratAggression] = reactExports.useState(0.5);
  const [stratCaution, setStratCaution] = reactExports.useState(0.3);
  const [tactThreats, setTactThreats] = reactExports.useState(0.3);
  const [tactCover, setTactCover] = reactExports.useState(0.5);
  const [tactTerrain, setTactTerrain] = reactExports.useState(0.2);
  const [tactSuppression, setTactSuppression] = reactExports.useState(0.1);
  const [tactUrgency, setTactUrgency] = reactExports.useState(0.4);
  const [tactContact, setTactContact] = reactExports.useState(false);
  const sendStrategic = reactExports.useCallback(() => {
    setStrategicIntent({
      source: "warcommand",
      movementPriority: stratPriority,
      speedBias: stratSpeed,
      stealthBias: stratStealth,
      aggressionBias: stratAggression,
      cautionBias: stratCaution,
      timestamp: Date.now()
    });
  }, [
    setStrategicIntent,
    stratPriority,
    stratSpeed,
    stratStealth,
    stratAggression,
    stratCaution
  ]);
  const clearStrategic = reactExports.useCallback(
    () => setStrategicIntent(null),
    [setStrategicIntent]
  );
  const sendTactical = reactExports.useCallback(() => {
    setTacticalContext({
      source: "battleops",
      immediateThreats: tactThreats,
      coverOpportunity: tactCover,
      terrainChallenge: tactTerrain,
      suppressionLevel: tactSuppression,
      urgencyMultiplier: tactUrgency,
      contactEngaged: tactContact,
      timestamp: Date.now()
    });
  }, [
    setTacticalContext,
    tactThreats,
    tactCover,
    tactTerrain,
    tactSuppression,
    tactUrgency,
    tactContact
  ]);
  const clearTactical = reactExports.useCallback(
    () => setTacticalContext(null),
    [setTacticalContext]
  );
  const {
    telemetry,
    mainBrain,
    regions,
    clusters,
    reflexLayer,
    bodyMesh,
    tickCount,
    timestampMs
  } = state;
  const selectedRegionData = selectedRegion ? regions[selectedRegion] : null;
  const selectedRegionClusters = selectedRegion ? JOINT_CLUSTERS.filter((c) => CLUSTER_TO_REGION[c] === selectedRegion) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: "oklch(0.10 0.02 220)",
        minHeight: "100%",
        color: "oklch(0.85 0.04 220)",
        fontFamily: "JetBrains Mono, monospace"
      },
      className: "p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "oklch(0.72 0.22 145)",
                  boxShadow: "0 0 8px oklch(0.72 0.22 145 / 0.8)",
                  animation: "pulse 2s ease-in-out infinite"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                style: {
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  color: "oklch(0.88 0.06 220)",
                  textTransform: "uppercase"
                },
                children: "Movement Substrate Control"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                style: {
                  background: `${modeColor(telemetry.activeMovementMode)}22`,
                  color: modeColor(telemetry.activeMovementMode),
                  border: `1px solid ${modeColor(telemetry.activeMovementMode)}44`,
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  fontFamily: "JetBrains Mono, monospace",
                  padding: "2px 6px"
                },
                children: telemetry.activeMovementMode.toUpperCase().replace("_", " ")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                fontSize: "9px",
                color: "oklch(0.42 0.04 220)",
                letterSpacing: "0.05em"
              },
              children: [
                "TICK ",
                tickCount,
                " · ",
                new Date(timestampMs).toLocaleTimeString()
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "bodymap", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsList,
            {
              style: {
                background: "oklch(0.14 0.03 220)",
                border: "1px solid oklch(0.22 0.04 220)",
                padding: "3px",
                height: "auto",
                gap: "2px",
                borderRadius: "6px",
                marginBottom: "16px"
              },
              className: "flex w-full",
              children: [
                { value: "bodymap", label: "BODY MAP", ocid: "avatar.bodymap.tab" },
                { value: "regions", label: "REGIONS", ocid: "avatar.regions.tab" },
                {
                  value: "telemetry",
                  label: "TELEMETRY",
                  ocid: "avatar.telemetry.tab"
                },
                { value: "tuning", label: "TUNING", ocid: "avatar.tuning.tab" },
                {
                  value: "integration",
                  label: "INTEGRATION",
                  ocid: "avatar.integration.tab"
                }
              ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsTrigger,
                {
                  value: t.value,
                  "data-ocid": t.ocid,
                  style: {
                    flex: 1,
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    padding: "5px 4px",
                    fontFamily: "JetBrains Mono, monospace"
                  },
                  children: t.label
                },
                t.value
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "bodymap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 flex-col lg:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-4",
                style: { minWidth: 220 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        background: "oklch(0.13 0.03 220)",
                        border: "1px solid oklch(0.22 0.04 220)",
                        borderRadius: 8,
                        padding: "12px 16px"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontSize: "8px",
                              letterSpacing: "0.12em",
                              color: "oklch(0.45 0.04 220)",
                              marginBottom: 8,
                              textAlign: "center"
                            },
                            children: "BODY ACTIVATION MAP"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          BodyMapSVG,
                          {
                            regions,
                            selectedRegion,
                            onSelectRegion: (id) => setSelectedRegion((prev) => prev === id ? null : id)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              fontSize: "8px",
                              color: "oklch(0.4 0.04 220)",
                              textAlign: "center",
                              marginTop: 6
                            },
                            children: "Click region to inspect"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 w-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "oklch(0.13 0.03 220)",
                          border: "1px solid oklch(0.22 0.04 220)",
                          borderRadius: 6,
                          padding: "8px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "8px",
                                color: "oklch(0.45 0.04 220)",
                                marginBottom: 4
                              },
                              children: "STABILITY"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "16px",
                                fontWeight: 700,
                                color: activationColor(telemetry.stabilityScore)
                              },
                              children: (telemetry.stabilityScore * 100).toFixed(0)
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: { fontSize: "7px", color: "oklch(0.38 0.04 220)" },
                              children: "/ 100"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "oklch(0.13 0.03 220)",
                          border: `1px solid ${modeColor(telemetry.activeMovementMode)}33`,
                          borderRadius: 6,
                          padding: "8px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "8px",
                                color: "oklch(0.45 0.04 220)",
                                marginBottom: 4
                              },
                              children: "MODE"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "8px",
                                fontWeight: 700,
                                color: modeColor(telemetry.activeMovementMode),
                                letterSpacing: "0.05em"
                              },
                              children: telemetry.activeMovementMode.replace("_", " ").toUpperCase()
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "oklch(0.13 0.03 220)",
                          border: "1px solid oklch(0.22 0.04 220)",
                          borderRadius: 6,
                          padding: "8px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "8px",
                                color: "oklch(0.45 0.04 220)",
                                marginBottom: 4
                              },
                              children: "POSTURE"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "7px",
                                fontWeight: 700,
                                color: "oklch(0.72 0.18 200)",
                                letterSpacing: "0.03em"
                              },
                              children: telemetry.currentPostureBias.replace("_", " ").toUpperCase()
                            }
                          )
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 flex-1", children: [
              selectedRegionData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.28 0.06 200)",
                    borderRadius: 8,
                    padding: "12px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            color: "oklch(0.80 0.10 200)"
                          },
                          children: REGION_LABELS[selectedRegion]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        selectedRegionData.reflexOverrideActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            style: {
                              background: "oklch(0.75 0.28 60 / 0.15)",
                              color: "oklch(0.75 0.28 60)",
                              border: "1px solid oklch(0.75 0.28 60 / 0.4)",
                              fontSize: "8px",
                              animation: "pulse 1s ease-in-out infinite"
                            },
                            children: "REFLEX ACTIVE"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => setSelectedRegion(null),
                            style: {
                              color: "oklch(0.4 0.04 220)",
                              fontSize: "10px",
                              background: "none",
                              border: "none",
                              cursor: "pointer"
                            },
                            children: "✕"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ActivationBar,
                        {
                          value: selectedRegionData.currentActivation,
                          label: "CURRENT"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ActivationBar,
                        {
                          value: selectedRegionData.targetActivation,
                          label: "TARGET"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniBar,
                        {
                          value: selectedRegionData.locomotionContribution,
                          color: "oklch(0.72 0.22 145)",
                          label: "LOCO"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniBar,
                        {
                          value: selectedRegionData.postureContribution,
                          color: "oklch(0.72 0.18 200)",
                          label: "POSTURE"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniBar,
                        {
                          value: selectedRegionData.manipulationContribution,
                          color: "oklch(0.72 0.20 280)",
                          label: "MANIP"
                        }
                      )
                    ] }),
                    selectedRegionClusters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            fontSize: "8px",
                            color: "oklch(0.42 0.04 220)",
                            marginBottom: 6,
                            letterSpacing: "0.08em"
                          },
                          children: "JOINT CLUSTERS"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: selectedRegionClusters.map((c) => {
                        const cl = clusters[c];
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                color: "oklch(0.55 0.05 220)",
                                fontSize: "9px",
                                width: 110
                              },
                              children: CLUSTER_LABELS[c]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ActivationBar, { value: cl.currentActivation }),
                          cl.reflexOverride && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                color: "oklch(0.75 0.28 60)",
                                fontSize: "8px"
                              },
                              children: "⚡"
                            }
                          )
                        ] }, c);
                      }) })
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "avatar.bodymap.empty_state",
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.20 0.03 220)",
                    borderRadius: 8,
                    padding: "20px 12px",
                    textAlign: "center",
                    color: "oklch(0.4 0.04 220)",
                    fontSize: "10px"
                  },
                  children: "Select a region on the body map to inspect"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.22 0.04 220)",
                    borderRadius: 8,
                    padding: "12px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontSize: "9px",
                            letterSpacing: "0.1em",
                            color: "oklch(0.55 0.05 220)"
                          },
                          children: "ACTIVE REFLEXES"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          style: {
                            background: reflexLayer.length > 0 ? "oklch(0.75 0.28 60 / 0.15)" : "oklch(0.18 0.03 220)",
                            color: reflexLayer.length > 0 ? "oklch(0.75 0.28 60)" : "oklch(0.42 0.04 220)",
                            border: `1px solid ${reflexLayer.length > 0 ? "oklch(0.75 0.28 60 / 0.3)" : "oklch(0.25 0.03 220)"}`,
                            fontSize: "8px"
                          },
                          children: reflexLayer.length
                        }
                      )
                    ] }),
                    reflexLayer.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: { fontSize: "9px", color: "oklch(0.38 0.04 220)" },
                        children: "No active reflexes"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: reflexLayer.map((rx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `avatar.reflex.item.${i + 1}`,
                        className: "flex items-center gap-2",
                        style: {
                          background: "oklch(0.16 0.03 220)",
                          borderRadius: 4,
                          padding: "4px 8px",
                          border: "1px solid oklch(0.75 0.28 60 / 0.2)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                color: "oklch(0.72 0.22 60)",
                                fontSize: "9px",
                                fontWeight: 600,
                                flex: 1
                              },
                              children: rx.reflexType.replace(/_/g, " ").toUpperCase()
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                color: "oklch(0.52 0.05 220)",
                                fontSize: "8px"
                              },
                              children: rx.clusterId
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                width: 48,
                                height: 4,
                                background: "oklch(0.20 0.03 220)",
                                borderRadius: 2,
                                overflow: "hidden"
                              },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    width: `${rx.intensity * 100}%`,
                                    height: "100%",
                                    background: "oklch(0.72 0.28 45)",
                                    borderRadius: 2
                                  }
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                color: "oklch(0.42 0.04 220)",
                                fontSize: "8px",
                                width: 20
                              },
                              children: [
                                rx.remainingTicks,
                                "t"
                              ]
                            }
                          )
                        ]
                      },
                      rx.reflexType + rx.clusterId + rx.startedAt
                    )) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.22 0.04 220)",
                    borderRadius: 8,
                    padding: "12px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.1em",
                          color: "oklch(0.55 0.05 220)",
                          marginBottom: 8
                        },
                        children: "PIPELINE STATUS"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: PIPELINE_STEPS.map((step) => {
                      const status = telemetry.pipelineStepStatus[step];
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            background: `${pipelineColor(status)}15`,
                            border: `1px solid ${pipelineColor(status)}40`,
                            borderRadius: 3,
                            padding: "3px 6px",
                            fontSize: "8px",
                            color: pipelineColor(status),
                            letterSpacing: "0.06em",
                            fontWeight: 600
                          },
                          children: PIPELINE_LABELS[step]
                        },
                        step
                      );
                    }) })
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "regions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: BODY_REGIONS.map((regionId) => {
              const r = regions[regionId];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "avatar.region.card",
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: `1px solid ${r.reflexOverrideActive ? "oklch(0.72 0.28 60 / 0.5)" : "oklch(0.22 0.04 220)"}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    boxShadow: r.reflexOverrideActive ? "0 0 12px oklch(0.72 0.28 60 / 0.15)" : "none",
                    animation: r.reflexOverrideActive ? "pulse 1.5s ease-in-out infinite" : "none"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "oklch(0.75 0.08 220)"
                          },
                          children: REGION_LABELS[regionId]
                        }
                      ),
                      r.reflexOverrideActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontSize: "7px",
                            color: "oklch(0.72 0.28 60)"
                          },
                          children: "⚡ REFLEX"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ActivationBar, { value: r.currentActivation, label: "CURR" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ActivationBar, { value: r.targetActivation, label: "TGT" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniBar,
                        {
                          value: r.locomotionContribution,
                          color: "oklch(0.72 0.22 145)",
                          label: "LOCO"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniBar,
                        {
                          value: r.postureContribution,
                          color: "oklch(0.72 0.18 200)",
                          label: "POSTURE"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniBar,
                        {
                          value: r.manipulationContribution,
                          color: "oklch(0.72 0.20 280)",
                          label: "MANIP"
                        }
                      )
                    ] })
                  ]
                },
                regionId
              );
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  overflow: "hidden"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "avatar.cluster.toggle",
                      onClick: () => setClustersExpanded((p) => !p),
                      style: {
                        width: "100%",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "oklch(0.60 0.06 220)",
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        fontFamily: "JetBrains Mono, monospace"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "JOINT CLUSTER TABLE (",
                          JOINT_CLUSTERS.length,
                          " CLUSTERS)"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: clustersExpanded ? "▲" : "▼" })
                      ]
                    }
                  ),
                  clustersExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { style: { maxHeight: 400 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { style: { borderColor: "oklch(0.22 0.04 220)" }, children: [
                      "CLUSTER",
                      "REGION",
                      "CURR",
                      "DESIRED",
                      "STIFF",
                      "DAMP",
                      "CONTACT",
                      "LOAD",
                      "REFLEX"
                    ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TableHead,
                      {
                        style: {
                          fontSize: "8px",
                          color: "oklch(0.45 0.04 220)",
                          letterSpacing: "0.06em",
                          padding: "6px 8px"
                        },
                        children: h
                      },
                      h
                    )) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: JOINT_CLUSTERS.map((cId) => {
                      const cl = clusters[cId];
                      const isHighLoad = cl.smoothedOutput > 0.75;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        TableRow,
                        {
                          style: {
                            borderColor: "oklch(0.18 0.03 220)",
                            background: isHighLoad ? "oklch(0.75 0.22 60 / 0.06)" : "transparent"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              TableCell,
                              {
                                style: {
                                  fontSize: "9px",
                                  color: isHighLoad ? "oklch(0.78 0.22 60)" : "oklch(0.65 0.06 220)",
                                  padding: "5px 8px",
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: CLUSTER_LABELS[cId]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              TableCell,
                              {
                                style: {
                                  fontSize: "8px",
                                  color: "oklch(0.45 0.04 220)",
                                  padding: "5px 8px"
                                },
                                children: cl.regionId.replace("_", " ")
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  color: activationColor(cl.currentActivation),
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: [
                                  (cl.currentActivation * 100).toFixed(0),
                                  "%"
                                ]
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  color: "oklch(0.55 0.05 220)",
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: [
                                  (cl.desiredActivation * 100).toFixed(0),
                                  "%"
                                ]
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  color: "oklch(0.55 0.06 200)",
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: cl.stiffness.toFixed(2)
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  color: "oklch(0.50 0.05 220)",
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: cl.damping.toFixed(2)
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  color: cl.contactAdaptation > 0.5 ? "oklch(0.72 0.22 145)" : "oklch(0.38 0.04 220)",
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: cl.contactAdaptation.toFixed(2)
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  color: cl.loadBearing ? "oklch(0.72 0.22 145)" : "oklch(0.38 0.04 220)",
                                  fontFamily: "JetBrains Mono, monospace"
                                },
                                children: cl.loadBearing ? "YES" : "NO"
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { style: { padding: "5px 8px" }, children: cl.reflexOverride && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  color: "oklch(0.75 0.28 60)",
                                  fontSize: "9px"
                                },
                                children: "⚡"
                              }
                            ) })
                          ]
                        },
                        cId
                      );
                    }) })
                  ] }) })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "telemetry", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: `1px solid ${modeColor(telemetry.activeMovementMode)}33`,
                    borderRadius: 8,
                    padding: "14px",
                    textAlign: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "8px",
                          color: "oklch(0.42 0.04 220)",
                          marginBottom: 8,
                          letterSpacing: "0.1em"
                        },
                        children: "MOVEMENT MODE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "18px",
                          fontWeight: 700,
                          color: modeColor(telemetry.activeMovementMode),
                          letterSpacing: "0.06em",
                          textShadow: `0 0 12px ${modeColor(telemetry.activeMovementMode)}60`
                        },
                        children: telemetry.activeMovementMode.replace("_", " ").toUpperCase()
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "8px",
                          color: "oklch(0.42 0.04 220)",
                          marginTop: 6
                        },
                        children: telemetry.currentPostureBias.replace("_", " ").toUpperCase()
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.22 0.04 220)",
                    borderRadius: 8,
                    padding: "12px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "8px",
                          color: "oklch(0.60 0.10 200)",
                          marginBottom: 6,
                          letterSpacing: "0.1em"
                        },
                        children: "WARCOMMAND INPUT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "9px",
                          color: "oklch(0.62 0.06 220)",
                          lineHeight: 1.5,
                          marginBottom: 8
                        },
                        children: telemetry.strategicInfluenceSummary
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MiniBar,
                      {
                        value: mainBrain.strategicInfluence,
                        color: "oklch(0.65 0.18 200)",
                        label: "INFLUENCE"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: "oklch(0.13 0.03 220)",
                    border: "1px solid oklch(0.22 0.04 220)",
                    borderRadius: 8,
                    padding: "12px"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "8px",
                          color: "oklch(0.68 0.18 45)",
                          marginBottom: 6,
                          letterSpacing: "0.1em"
                        },
                        children: "BATTLEOPS INPUT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "9px",
                          color: "oklch(0.62 0.06 220)",
                          lineHeight: 1.5,
                          marginBottom: 8
                        },
                        children: telemetry.tacticalInfluenceSummary
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MiniBar,
                      {
                        value: mainBrain.tacticalInfluence,
                        color: "oklch(0.72 0.22 45)",
                        label: "INFLUENCE"
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 10
                      },
                      children: "BODY-STATE MESH"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [
                    {
                      label: "OVERALL STABILITY",
                      value: bodyMesh.overallStabilityScore
                    },
                    {
                      label: "MOTION SMOOTHNESS",
                      value: bodyMesh.motionSmoothnessScore
                    },
                    {
                      label: "PROPRIOCEPTIVE CONF",
                      value: bodyMesh.proprioceptiveConfidence
                    },
                    { label: "TOTAL FATIGUE", value: bodyMesh.totalFatigueLoad },
                    {
                      label: "TERRAIN DIFFICULTY",
                      value: bodyMesh.terrainDifficultyEstimate
                    },
                    {
                      label: "CONTACT POINTS",
                      value: Object.values(bodyMesh.contactPoints).filter(Boolean).length / 4
                    }
                  ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontSize: "8px",
                          color: "oklch(0.42 0.04 220)",
                          marginBottom: 3,
                          letterSpacing: "0.06em"
                        },
                        children: item.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ActivationBar, { value: item.value })
                  ] }, item.label)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 10
                      },
                      children: "JOINT LOAD HEATMAP"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 md:grid-cols-6 gap-1.5", children: JOINT_CLUSTERS.map((cId) => {
                    var _a;
                    const load = ((_a = clusters[cId]) == null ? void 0 : _a.smoothedOutput) ?? 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        title: `${CLUSTER_LABELS[cId]}: ${(load * 100).toFixed(0)}%`,
                        style: {
                          background: activationBg(load, 0.8),
                          borderRadius: 4,
                          padding: "5px 4px",
                          textAlign: "center",
                          border: "1px solid oklch(0.22 0.04 220)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "6.5px",
                                color: "oklch(0.85 0.04 220)",
                                letterSpacing: "0.04em",
                                lineHeight: 1.2,
                                marginBottom: 2
                              },
                              children: CLUSTER_LABELS[cId].toUpperCase()
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "9px",
                                fontWeight: 700,
                                color: activationColor(load)
                              },
                              children: (load * 100).toFixed(0)
                            }
                          )
                        ]
                      },
                      cId
                    );
                  }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 8
                      },
                      children: "CONFLICT RESOLUTION LOG"
                    }
                  ),
                  mainBrain.conflictResolutionLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "9px", color: "oklch(0.35 0.04 220)" }, children: "No conflicts recorded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: mainBrain.conflictResolutionLog.slice(-5).map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": `avatar.conflict.item.${i + 1}`,
                      style: {
                        fontSize: "9px",
                        color: "oklch(0.62 0.10 45)",
                        background: "oklch(0.16 0.04 220)",
                        borderRadius: 3,
                        padding: "4px 8px",
                        borderLeft: "2px solid oklch(0.72 0.22 45 / 0.5)"
                      },
                      children: entry
                    },
                    entry
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        fontSize: "8px",
                        color: "oklch(0.38 0.04 220)",
                        marginTop: 8
                      },
                      children: [
                        "TICK ",
                        tickCount,
                        " ·",
                        " ",
                        new Date(timestampMs).toISOString().slice(11, 23)
                      ]
                    }
                  )
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tuning", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { style: { height: "calc(100vh - 200px)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 pr-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 10
                      },
                      children: "PRESETS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": "avatar.preset.combat.button",
                        onClick: () => applyPreset("combat"),
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          background: "oklch(0.65 0.22 35 / 0.2)",
                          border: "1px solid oklch(0.65 0.22 35 / 0.5)",
                          color: "oklch(0.75 0.22 35)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "COMBAT READY"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": "avatar.preset.stealth.button",
                        onClick: () => applyPreset("stealth"),
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          background: "oklch(0.60 0.18 280 / 0.2)",
                          border: "1px solid oklch(0.60 0.18 280 / 0.5)",
                          color: "oklch(0.70 0.18 280)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "STEALTH WALK"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": "avatar.preset.recovery.button",
                        onClick: () => applyPreset("recovery"),
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          background: "oklch(0.65 0.20 310 / 0.2)",
                          border: "1px solid oklch(0.65 0.20 310 / 0.5)",
                          color: "oklch(0.72 0.20 310)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "RECOVERY MODE"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": "avatar.preset.baseline.button",
                        onClick: () => applyPreset("baseline"),
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          background: "oklch(0.18 0.03 220)",
                          border: "1px solid oklch(0.30 0.04 220)",
                          color: "oklch(0.62 0.06 220)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "BASELINE"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 12
                      },
                      children: "CORE PARAMETERS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Embodiment Fidelity",
                        value: tuning.embodimentFidelity,
                        onChange: (v) => handleTuning("embodimentFidelity", v),
                        ocid: "avatar.tuning.embodiment.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Reflex Sensitivity",
                        value: tuning.reflexSensitivity,
                        onChange: (v) => handleTuning("reflexSensitivity", v),
                        ocid: "avatar.tuning.reflex.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Body Preservation",
                        value: tuning.bodyPreservationWeight,
                        onChange: (v) => handleTuning("bodyPreservationWeight", v),
                        ocid: "avatar.tuning.preservation.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Balance Priority",
                        value: tuning.balancePriority,
                        onChange: (v) => handleTuning("balancePriority", v),
                        ocid: "avatar.tuning.balance.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              color: "oklch(0.6 0.05 220)",
                              fontSize: "10px",
                              fontFamily: "JetBrains Mono, monospace"
                            },
                            children: "Smooth ← → Aggressive"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              color: "oklch(0.75 0.15 200)",
                              fontSize: "10px",
                              fontFamily: "JetBrains Mono, monospace"
                            },
                            children: tuning.smoothnessVsAggression.toFixed(2)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Slider,
                        {
                          value: [tuning.smoothnessVsAggression],
                          min: 0,
                          max: 1,
                          step: 0.01,
                          onValueChange: ([v]) => handleTuning("smoothnessVsAggression", v),
                          "data-ocid": "avatar.tuning.smoothness.input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Recovery Aggressiveness",
                        value: tuning.recoveryAggressiveness,
                        onChange: (v) => handleTuning("recoveryAggressiveness", v),
                        ocid: "avatar.tuning.recovery.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Terrain Adaptation",
                        value: tuning.terrainAdaptationWeight,
                        onChange: (v) => handleTuning("terrainAdaptationWeight", v),
                        ocid: "avatar.tuning.terrain.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Injury Compensation",
                        value: tuning.injuryCompensationScale,
                        onChange: (v) => handleTuning("injuryCompensationScale", v),
                        ocid: "avatar.tuning.injury.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Contact Confidence",
                        value: tuning.contactConfidence,
                        onChange: (v) => handleTuning("contactConfidence", v),
                        ocid: "avatar.tuning.contact.input"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 12
                      },
                      children: "GAIT PARAMETERS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Step Frequency",
                        value: tuning.stepFrequency,
                        onChange: (v) => handleTuning("stepFrequency", v),
                        ocid: "avatar.tuning.stepfreq.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Stride Length",
                        value: tuning.strideLength,
                        onChange: (v) => handleTuning("strideLength", v),
                        ocid: "avatar.tuning.stride.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Hip Swing",
                        value: tuning.hipSwing,
                        onChange: (v) => handleTuning("hipSwing", v),
                        ocid: "avatar.tuning.hipswing.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Arm Swing",
                        value: tuning.armSwing,
                        onChange: (v) => handleTuning("armSwing", v),
                        ocid: "avatar.tuning.armswing.input"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 12
                      },
                      children: "PER-REGION STIFFNESS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: BODY_REGIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TuningSlider,
                    {
                      label: REGION_LABELS[r].split(" / ")[0],
                      value: tuning.regionalStiffness[r],
                      onChange: (v) => handleRegionalTuning("regionalStiffness", r, v),
                      ocid: "avatar.tuning.stiffness.input"
                    },
                    r
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 12
                      },
                      children: "PER-REGION RESPONSIVENESS"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: BODY_REGIONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TuningSlider,
                    {
                      label: REGION_LABELS[r].split(" / ")[0],
                      value: tuning.regionalResponsiveness[r],
                      onChange: (v) => handleRegionalTuning("regionalResponsiveness", r, v),
                      ocid: "avatar.tuning.responsiveness.input"
                    },
                    r
                  )) })
                ]
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "integration", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.45 0.12 200 / 0.4)",
                  borderRadius: 8,
                  padding: "14px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "oklch(0.65 0.18 200)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.10em",
                          color: "oklch(0.70 0.12 200)"
                        },
                        children: "WARCOMMAND — STRATEGIC INTENT"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          style: {
                            fontSize: "9px",
                            color: "oklch(0.52 0.05 220)",
                            letterSpacing: "0.08em",
                            fontFamily: "JetBrains Mono, monospace"
                          },
                          children: "MOVEMENT PRIORITY"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: stratPriority,
                          onValueChange: (v) => setStratPriority(
                            v
                          ),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                "data-ocid": "avatar.strategic.priority.select",
                                style: {
                                  marginTop: 4,
                                  fontSize: "10px",
                                  fontFamily: "JetBrains Mono, monospace",
                                  background: "oklch(0.16 0.03 220)",
                                  border: "1px solid oklch(0.26 0.04 220)",
                                  color: "oklch(0.75 0.06 220)"
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectContent,
                              {
                                style: {
                                  background: "oklch(0.16 0.03 220)",
                                  border: "1px solid oklch(0.26 0.04 220)"
                                },
                                children: [
                                  "advance",
                                  "hold",
                                  "retreat",
                                  "flank",
                                  "regroup",
                                  "none"
                                ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  SelectItem,
                                  {
                                    value: p,
                                    style: {
                                      fontSize: "10px",
                                      fontFamily: "JetBrains Mono, monospace",
                                      color: "oklch(0.72 0.06 220)"
                                    },
                                    children: p.toUpperCase()
                                  },
                                  p
                                ))
                              }
                            )
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Speed Bias",
                        value: stratSpeed,
                        onChange: setStratSpeed,
                        ocid: "avatar.strategic.speed.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Stealth Bias",
                        value: stratStealth,
                        onChange: setStratStealth,
                        ocid: "avatar.strategic.stealth.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Aggression Bias",
                        value: stratAggression,
                        onChange: setStratAggression,
                        ocid: "avatar.strategic.aggression.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Caution Bias",
                        value: stratCaution,
                        onChange: setStratCaution,
                        ocid: "avatar.strategic.caution.input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": "avatar.strategic.send.button",
                        onClick: sendStrategic,
                        style: {
                          flex: 1,
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          background: "oklch(0.52 0.16 200 / 0.25)",
                          border: "1px solid oklch(0.52 0.16 200 / 0.6)",
                          color: "oklch(0.75 0.18 200)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "SEND STRATEGIC INTENT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        "data-ocid": "avatar.strategic.clear.button",
                        onClick: clearStrategic,
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          background: "oklch(0.16 0.03 220)",
                          border: "1px solid oklch(0.26 0.04 220)",
                          color: "oklch(0.52 0.05 220)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "CLEAR"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.55 0.18 45 / 0.35)",
                  borderRadius: 8,
                  padding: "14px"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "oklch(0.72 0.22 45)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        style: {
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.10em",
                          color: "oklch(0.72 0.18 45)"
                        },
                        children: "BATTLEOPS — TACTICAL CONTEXT"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Immediate Threats",
                        value: tactThreats,
                        onChange: setTactThreats,
                        ocid: "avatar.tactical.threats.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Cover Opportunity",
                        value: tactCover,
                        onChange: setTactCover,
                        ocid: "avatar.tactical.cover.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Terrain Challenge",
                        value: tactTerrain,
                        onChange: setTactTerrain,
                        ocid: "avatar.tactical.terrain.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Suppression Level",
                        value: tactSuppression,
                        onChange: setTactSuppression,
                        ocid: "avatar.tactical.suppression.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TuningSlider,
                      {
                        label: "Urgency Multiplier",
                        value: tactUrgency,
                        onChange: setTactUrgency,
                        ocid: "avatar.tactical.urgency.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Checkbox,
                        {
                          id: "contact-engaged",
                          checked: tactContact,
                          onCheckedChange: (v) => setTactContact(!!v),
                          "data-ocid": "avatar.tactical.contact.checkbox",
                          style: { borderColor: "oklch(0.35 0.06 220)" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Label,
                        {
                          htmlFor: "contact-engaged",
                          style: {
                            fontSize: "10px",
                            color: "oklch(0.60 0.06 220)",
                            fontFamily: "JetBrains Mono, monospace",
                            cursor: "pointer"
                          },
                          children: "CONTACT ENGAGED"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        "data-ocid": "avatar.tactical.send.button",
                        onClick: sendTactical,
                        style: {
                          flex: 1,
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          background: "oklch(0.55 0.18 45 / 0.22)",
                          border: "1px solid oklch(0.55 0.18 45 / 0.55)",
                          color: "oklch(0.78 0.22 45)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "SEND TACTICAL CONTEXT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        "data-ocid": "avatar.tactical.clear.button",
                        onClick: clearTactical,
                        style: {
                          fontSize: "9px",
                          letterSpacing: "0.06em",
                          background: "oklch(0.16 0.03 220)",
                          border: "1px solid oklch(0.26 0.04 220)",
                          color: "oklch(0.52 0.05 220)",
                          fontFamily: "JetBrains Mono, monospace"
                        },
                        children: "CLEAR"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: "oklch(0.13 0.03 220)",
                  border: "1px solid oklch(0.22 0.04 220)",
                  borderRadius: 8,
                  padding: "14px"
                },
                className: "md:col-span-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      style: {
                        fontSize: "9px",
                        letterSpacing: "0.10em",
                        color: "oklch(0.55 0.05 220)",
                        marginBottom: 12
                      },
                      children: "LIVE RESPONSE PREVIEW"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: `${modeColor(telemetry.activeMovementMode)}15`,
                          border: `1px solid ${modeColor(telemetry.activeMovementMode)}30`,
                          borderRadius: 6,
                          padding: "10px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "7px",
                                color: "oklch(0.42 0.04 220)",
                                marginBottom: 4,
                                letterSpacing: "0.08em"
                              },
                              children: "MOVEMENT MODE"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "11px",
                                fontWeight: 700,
                                color: modeColor(telemetry.activeMovementMode)
                              },
                              children: telemetry.activeMovementMode.replace("_", " ").toUpperCase()
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "oklch(0.16 0.03 220)",
                          border: "1px solid oklch(0.24 0.04 220)",
                          borderRadius: 6,
                          padding: "10px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "7px",
                                color: "oklch(0.42 0.04 220)",
                                marginBottom: 4,
                                letterSpacing: "0.08em"
                              },
                              children: "POSTURE BIAS"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "9px",
                                fontWeight: 700,
                                color: "oklch(0.70 0.12 200)"
                              },
                              children: telemetry.currentPostureBias.replace("_", " ").toUpperCase()
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "oklch(0.16 0.03 220)",
                          border: "1px solid oklch(0.24 0.04 220)",
                          borderRadius: 6,
                          padding: "10px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "7px",
                                color: "oklch(0.42 0.04 220)",
                                marginBottom: 4,
                                letterSpacing: "0.08em"
                              },
                              children: "STRATEGIC INFLUENCE"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "oklch(0.68 0.18 200)"
                              },
                              children: [
                                (mainBrain.strategicInfluence * 100).toFixed(0),
                                "%"
                              ]
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          background: "oklch(0.16 0.03 220)",
                          border: "1px solid oklch(0.24 0.04 220)",
                          borderRadius: 6,
                          padding: "10px",
                          textAlign: "center"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                fontSize: "7px",
                                color: "oklch(0.42 0.04 220)",
                                marginBottom: 4,
                                letterSpacing: "0.08em"
                              },
                              children: "TACTICAL INFLUENCE"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              style: {
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "oklch(0.72 0.22 45)"
                              },
                              children: [
                                (mainBrain.tacticalInfluence * 100).toFixed(0),
                                "%"
                              ]
                            }
                          )
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HiveMindSection, {})
      ]
    }
  );
}
function HiveMindSection() {
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const { data: hive } = useHiveMindState();
  const coherence = (hive == null ? void 0 : hive.coherence) ?? 0.72;
  const dominant = (hive == null ? void 0 : hive.dominantSharedState) ?? "SYNCHRONIZED";
  const avatars = (hive == null ? void 0 : hive.avatars) ?? [
    {
      id: "AXIOM",
      behavioralState: "SOLVING",
      da: 0.74,
      ser: 0.61,
      ne: 0.55,
      cerebraSyncPct: 87
    },
    {
      id: "PHANTOM",
      behavioralState: "OBSERVING",
      da: 0.58,
      ser: 0.72,
      ne: 0.43,
      cerebraSyncPct: 79
    },
    {
      id: "SENTINEL",
      behavioralState: "SYNCHRONIZED",
      da: 0.63,
      ser: 0.68,
      ne: 0.71,
      cerebraSyncPct: 94
    },
    {
      id: "FLUX",
      behavioralState: "MINING",
      da: 0.81,
      ser: 0.49,
      ne: 0.66,
      cerebraSyncPct: 73
    }
  ];
  const coherenceColor = coherence > 0.7 ? "oklch(0.68 0.28 140)" : coherence > 0.3 ? "oklch(0.78 0.22 80)" : "oklch(0.65 0.25 25)";
  const badges = {
    AXIOM: "ANALYTICAL",
    PHANTOM: "CREATIVE",
    SENTINEL: "VIGILANT",
    FLUX: "ADAPTIVE"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "hivemind.section",
      style: {
        margin: "12px 8px 8px",
        border: "1px solid oklch(0.22 0.06 240)",
        borderRadius: 8,
        background: "oklch(0.09 0.018 260)",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "hivemind.collapse_toggle",
            onClick: () => setCollapsed((c) => !c),
            style: {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 12px",
              background: "oklch(0.11 0.025 260)",
              borderBottom: collapsed ? "none" : "1px solid oklch(0.18 0.05 240)",
              cursor: "pointer"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "oklch(0.62 0.22 195)",
                    fontWeight: 700
                  },
                  children: "HIVE MIND — AVATAR CONSCIOUSNESS NETWORK"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "oklch(0.4 0.05 220)"
                  },
                  children: collapsed ? "►" : "▼"
                }
              )
            ]
          }
        ),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 8,
                      color: "oklch(0.42 0.04 220)",
                      letterSpacing: "0.1em",
                      whiteSpace: "nowrap"
                    },
                    children: "COHERENCE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      flex: 1,
                      height: 6,
                      background: "oklch(0.14 0.03 250)",
                      borderRadius: 3,
                      overflow: "hidden"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          width: `${coherence * 100}%`,
                          height: "100%",
                          background: coherenceColor,
                          borderRadius: 3,
                          transition: "width 0.4s"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 9,
                      color: coherenceColor,
                      fontWeight: 700,
                      minWidth: 32
                    },
                    children: [
                      (coherence * 100).toFixed(0),
                      "%"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 8,
                      color: "oklch(0.55 0.12 200)",
                      letterSpacing: "0.08em",
                      padding: "2px 6px",
                      border: "1px solid oklch(0.22 0.06 240)",
                      borderRadius: 4
                    },
                    children: dominant
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
              children: avatars.map((av) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `hivemind.avatar.${av.id.toLowerCase()}`,
                  style: {
                    background: "oklch(0.12 0.025 255)",
                    border: "1px solid oklch(0.2 0.05 240)",
                    borderRadius: 6,
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontFamily: "monospace",
                                fontSize: 10,
                                fontWeight: 700,
                                color: "oklch(0.85 0.06 210)"
                              },
                              children: av.id
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              style: {
                                fontFamily: "monospace",
                                fontSize: 7,
                                color: "oklch(0.6 0.14 195)",
                                letterSpacing: "0.1em",
                                padding: "1px 5px",
                                border: "1px solid oklch(0.22 0.07 220)",
                                borderRadius: 3
                              },
                              children: badges[av.id] ?? "AGENT"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarBrainChip, { entityId: av.id }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        style: {
                          fontFamily: "monospace",
                          fontSize: 8,
                          color: "oklch(0.72 0.22 140)",
                          letterSpacing: "0.1em",
                          textAlign: "center"
                        },
                        children: av.behavioralState
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: { display: "flex", gap: 4, justifyContent: "center" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                fontFamily: "monospace",
                                fontSize: 7,
                                padding: "1px 5px",
                                borderRadius: 10,
                                background: "oklch(0.22 0.08 80)",
                                color: "oklch(0.82 0.22 80)"
                              },
                              children: [
                                "DA ",
                                (av.da * 100).toFixed(0)
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                fontFamily: "monospace",
                                fontSize: 7,
                                padding: "1px 5px",
                                borderRadius: 10,
                                background: "oklch(0.18 0.06 200)",
                                color: "oklch(0.72 0.2 200)"
                              },
                              children: [
                                "5HT ",
                                (av.ser * 100).toFixed(0)
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              style: {
                                fontFamily: "monospace",
                                fontSize: 7,
                                padding: "1px 5px",
                                borderRadius: 10,
                                background: "oklch(0.20 0.08 280)",
                                color: "oklch(0.72 0.18 280)"
                              },
                              children: [
                                "NE ",
                                (av.ne * 100).toFixed(0)
                              ]
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          style: {
                            fontFamily: "monospace",
                            fontSize: 7,
                            color: "oklch(0.42 0.04 220)",
                            letterSpacing: "0.06em"
                          },
                          children: "CEREBIX SYNC"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          style: {
                            flex: 1,
                            height: 3,
                            background: "oklch(0.14 0.03 250)",
                            borderRadius: 2,
                            overflow: "hidden"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              style: {
                                width: `${av.cerebraSyncPct}%`,
                                height: "100%",
                                background: "oklch(0.68 0.22 195)",
                                borderRadius: 2
                              }
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          style: {
                            fontFamily: "monospace",
                            fontSize: 7,
                            color: "oklch(0.62 0.18 195)",
                            minWidth: 24
                          },
                          children: [
                            av.cerebraSyncPct,
                            "%"
                          ]
                        }
                      )
                    ] })
                  ]
                },
                av.id
              ))
            }
          )
        ] })
      ]
    }
  );
}
export {
  AvatarTab,
  AvatarTab as default
};
