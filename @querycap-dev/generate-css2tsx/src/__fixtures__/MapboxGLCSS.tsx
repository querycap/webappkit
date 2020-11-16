// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Global } from "@emotion/react";

export const MapboxGLCSS = () => (
  <>
    <Global
      styles={{
        ".mapboxgl-map:-webkit-full-screen": {
          width: "100%",
          height: "100%",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canary": {
          backgroundColor: "salmon",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canvas-container.mapboxgl-interactive, .mapboxgl-ctrl-group button.mapboxgl-ctrl-compass": {
          cursor: "grab",
          MozUserSelect: "none",
          WebkitUserSelect: "none",
          MsUserSelect: "none",
          userSelect: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canvas-container.mapboxgl-interactive.mapboxgl-track-pointer": {
          cursor: "pointer",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canvas-container.mapboxgl-interactive:active, .mapboxgl-ctrl-group button.mapboxgl-ctrl-compass:active": {
          cursor: "grabbing",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canvas-container.mapboxgl-touch-zoom-rotate, .mapboxgl-canvas-container.mapboxgl-touch-zoom-rotate .mapboxgl-canvas": {
          touchAction: "pan-x pan-y",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canvas-container.mapboxgl-touch-drag-pan, .mapboxgl-canvas-container.mapboxgl-touch-drag-pan .mapboxgl-canvas": {
          touchAction: "pinch-zoom",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-canvas-container.mapboxgl-touch-zoom-rotate.mapboxgl-touch-drag-pan, .mapboxgl-canvas-container.mapboxgl-touch-zoom-rotate.mapboxgl-touch-drag-pan .mapboxgl-canvas": {
          touchAction: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-top-left, .mapboxgl-ctrl-top-right": {
          position: "absolute",
          pointerEvents: "none",
          zIndex: 2,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-top-left": {
          top: 0,
          left: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-top-right": {
          top: 0,
          right: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-bottom-left": {
          bottom: 0,
          left: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-bottom-right": {
          right: 0,
          bottom: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl": {
          clear: "both",
          pointerEvents: "auto",
          transform: "translate(0)",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-top-left .mapboxgl-ctrl": {
          margin: "10px 0 0 10px",
          float: "left",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-top-right .mapboxgl-ctrl": {
          margin: "10px 10px 0 0",
          float: "right",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-bottom-left .mapboxgl-ctrl": {
          margin: "0 0 10px 10px",
          float: "left",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-bottom-right .mapboxgl-ctrl": {
          margin: "0 10px 10px 0",
          float: "right",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group": {
          borderRadius: "4px",
          background: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group:not(:empty)": {
          MozBoxShadow: "0 0 2px rgba(0, 0, 0, 0.1)",
          WebkitBoxShadow: "0 0 2px rgba(0, 0, 0, 0.1)",
          boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button": {
          width: "29px",
          height: "29px",
          display: "block",
          padding: 0,
          outline: "none",
          border: 0,
          boxSizing: "border-box",
          backgroundColor: "transparent",
          cursor: "pointer",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button + button": {
          borderTop: "1px solid #ddd",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button .mapboxgl-ctrl-icon": {
          display: "block",
          width: "100%",
          height: "100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "50%",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button::-moz-focus-inner": {
          border: 0,
          padding: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button:focus": {
          boxShadow: "0 0 2px 2px #0096ff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button:disabled": {
          cursor: "not-allowed",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button:disabled .mapboxgl-ctrl-icon": {
          opacity: 0.25,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button:not(:disabled):hover": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button:focus:focus-visible": {
          boxShadow: "0 0 2px 2px #0096ff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button:focus:not(:focus-visible)": {
          boxShadow: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button:focus:first-of-type": {
          borderRadius: "4px 4px 0 0",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button:focus:last-child": {
          borderRadius: "0 0 4px 4px",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-group button:focus:only-child": {
          borderRadius: "inherit",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E%3Cpath d='M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E%3Cpath d='M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-fullscreen .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E%3Cpath d='M24 16v5.5c0 1.75-.75 2.5-2.5 2.5H16v-1l3-1.5-4-5.5 1-1 5.5 4 1.5-3h1zM6 16l1.5 3 5.5-4 1 1-4 5.5 3 1.5v1H7.5C5.75 24 5 23.25 5 21.5V16h1zm7-11v1l-3 1.5 4 5.5-1 1-5.5-4L6 13H5V7.5C5 5.75 5.75 5 7.5 5H13zm11 2.5c0-1.75-.75-2.5-2.5-2.5H16v1l3 1.5-4 5.5 1 1 5.5-4 1.5 3h1V7.5z'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-shrink .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-compass .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 29 29' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E%3Cpath d='M10.5 14l4-8 4 8h-8z'/%3E%3Cpath d='M10.5 16l4 8 4-8h-8z' fill='%23ccc'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23333'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate:disabled .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23aaa'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Cpath d='M14 5l1 1-9 9-1-1 9-9z' fill='red'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-active .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%2333b5e5'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-active-error .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23e58978'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-background .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%2333b5e5'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-background-error .mapboxgl-ctrl-icon": {
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='29' height='29' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='%23e54e33'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z'/%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl button.mapboxgl-ctrl-geolocate.mapboxgl-ctrl-geolocate-waiting .mapboxgl-ctrl-icon": {
          WebkitAnimation: "mapboxgl-spin 2s linear infinite",
          MozAnimation: "mapboxgl-spin 2s infinite linear",
          OAnimation: "mapboxgl-spin 2s infinite linear",
          MsAnimation: "mapboxgl-spin 2s infinite linear",
          animation: "mapboxgl-spin 2s linear infinite",
        },
      }}
    />

    <Global
      styles={{
        "a.mapboxgl-ctrl-logo": {
          width: "88px",
          height: "23px",
          margin: "0 0 -4px -4px",
          display: "block",
          backgroundRepeat: "no-repeat",
          cursor: "pointer",
          overflow: "hidden",
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='88' height='23' viewBox='0 0 88 23' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' fill-rule='evenodd'%3E%3Cdefs%3E%3Cpath id='a' d='M11.5 2.25c5.105 0 9.25 4.145 9.25 9.25s-4.145 9.25-9.25 9.25-9.25-4.145-9.25-9.25 4.145-9.25 9.25-9.25zM6.997 15.983c-.051-.338-.828-5.802 2.233-8.873a4.395 4.395 0 013.13-1.28c1.27 0 2.49.51 3.39 1.42.91.9 1.42 2.12 1.42 3.39 0 1.18-.449 2.301-1.28 3.13C12.72 16.93 7 16 7 16l-.003-.017zM15.3 10.5l-2 .8-.8 2-.8-2-2-.8 2-.8.8-2 .8 2 2 .8z'/%3E%3Cpath id='b' d='M50.63 8c.13 0 .23.1.23.23V9c.7-.76 1.7-1.18 2.73-1.18 2.17 0 3.95 1.85 3.95 4.17s-1.77 4.19-3.94 4.19c-1.04 0-2.03-.43-2.74-1.18v3.77c0 .13-.1.23-.23.23h-1.4c-.13 0-.23-.1-.23-.23V8.23c0-.12.1-.23.23-.23h1.4zm-3.86.01c.01 0 .01 0 .01-.01.13 0 .22.1.22.22v7.55c0 .12-.1.23-.23.23h-1.4c-.13 0-.23-.1-.23-.23V15c-.7.76-1.69 1.19-2.73 1.19-2.17 0-3.94-1.87-3.94-4.19 0-2.32 1.77-4.19 3.94-4.19 1.03 0 2.02.43 2.73 1.18v-.75c0-.12.1-.23.23-.23h1.4zm26.375-.19a4.24 4.24 0 00-4.16 3.29c-.13.59-.13 1.19 0 1.77a4.233 4.233 0 004.17 3.3c2.35 0 4.26-1.87 4.26-4.19 0-2.32-1.9-4.17-4.27-4.17zM60.63 5c.13 0 .23.1.23.23v3.76c.7-.76 1.7-1.18 2.73-1.18 1.88 0 3.45 1.4 3.84 3.28.13.59.13 1.2 0 1.8-.39 1.88-1.96 3.29-3.84 3.29-1.03 0-2.02-.43-2.73-1.18v.77c0 .12-.1.23-.23.23h-1.4c-.13 0-.23-.1-.23-.23V5.23c0-.12.1-.23.23-.23h1.4zm-34 11h-1.4c-.13 0-.23-.11-.23-.23V8.22c.01-.13.1-.22.23-.22h1.4c.13 0 .22.11.23.22v.68c.5-.68 1.3-1.09 2.16-1.1h.03c1.09 0 2.09.6 2.6 1.55.45-.95 1.4-1.55 2.44-1.56 1.62 0 2.93 1.25 2.9 2.78l.03 5.2c0 .13-.1.23-.23.23h-1.41c-.13 0-.23-.11-.23-.23v-4.59c0-.98-.74-1.71-1.62-1.71-.8 0-1.46.7-1.59 1.62l.01 4.68c0 .13-.11.23-.23.23h-1.41c-.13 0-.23-.11-.23-.23v-4.59c0-.98-.74-1.71-1.62-1.71-.85 0-1.54.79-1.6 1.8v4.5c0 .13-.1.23-.23.23zm53.615 0h-1.61c-.04 0-.08-.01-.12-.03-.09-.06-.13-.19-.06-.28l2.43-3.71-2.39-3.65a.213.213 0 01-.03-.12c0-.12.09-.21.21-.21h1.61c.13 0 .24.06.3.17l1.41 2.37 1.4-2.37a.34.34 0 01.3-.17h1.6c.04 0 .08.01.12.03.09.06.13.19.06.28l-2.37 3.65 2.43 3.7c0 .05.01.09.01.13 0 .12-.09.21-.21.21h-1.61c-.13 0-.24-.06-.3-.17l-1.44-2.42-1.44 2.42a.34.34 0 01-.3.17zm-7.12-1.49c-1.33 0-2.42-1.12-2.42-2.51 0-1.39 1.08-2.52 2.42-2.52 1.33 0 2.42 1.12 2.42 2.51 0 1.39-1.08 2.51-2.42 2.52zm-19.865 0c-1.32 0-2.39-1.11-2.42-2.48v-.07c.02-1.38 1.09-2.49 2.4-2.49 1.32 0 2.41 1.12 2.41 2.51 0 1.39-1.07 2.52-2.39 2.53zm-8.11-2.48c-.01 1.37-1.09 2.47-2.41 2.47s-2.42-1.12-2.42-2.51c0-1.39 1.08-2.52 2.4-2.52 1.33 0 2.39 1.11 2.41 2.48l.02.08zm18.12 2.47c-1.32 0-2.39-1.11-2.41-2.48v-.06c.02-1.38 1.09-2.48 2.41-2.48s2.42 1.12 2.42 2.51c0 1.39-1.09 2.51-2.42 2.51z'/%3E%3C/defs%3E%3Cmask id='c'%3E%3Crect width='100%25' height='100%25' fill='%23fff'/%3E%3Cuse xlink:href='%23a'/%3E%3Cuse xlink:href='%23b'/%3E%3C/mask%3E%3Cg opacity='.3' stroke='%23000' stroke-width='3'%3E%3Ccircle mask='url(%23c)' cx='11.5' cy='11.5' r='9.25'/%3E%3Cuse xlink:href='%23b' mask='url(%23c)'/%3E%3C/g%3E%3Cg opacity='.9' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3Cuse xlink:href='%23b'/%3E%3C/g%3E%3C/svg%3E\")",
        },
      }}
    />

    <Global
      styles={{
        "a.mapboxgl-ctrl-logo.mapboxgl-compact": {
          width: "23px",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl.mapboxgl-ctrl-attrib": {
          padding: "0 5px",
          backgroundColor: "hsla(0, 0%, 100%, 0.5)",
          margin: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-attrib a": {
          color: "rgba(0, 0, 0, 0.75)",
          textDecoration: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-attrib a:hover": {
          color: "inherit",
          textDecoration: "underline",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-attrib .mapbox-improve-map": {
          fontWeight: 700,
          marginLeft: "2px",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-attrib-empty": {
          display: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-ctrl-scale": {
          backgroundColor: "hsla(0, 0%, 100%, 0.75)",
          fontSize: "10px",
          border: "2px solid #333",
          borderTop: "#333",
          padding: "0 5px",
          color: "#333",
          boxSizing: "border-box",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup": {
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          willChange: "transform",
          pointerEvents: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-top, .mapboxgl-popup-anchor-top-left, .mapboxgl-popup-anchor-top-right": {
          WebkitFlexDirection: "column",
          flexDirection: "column",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-bottom, .mapboxgl-popup-anchor-bottom-left, .mapboxgl-popup-anchor-bottom-right": {
          WebkitFlexDirection: "column-reverse",
          flexDirection: "column-reverse",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-left": {
          WebkitFlexDirection: "row",
          flexDirection: "row",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-right": {
          WebkitFlexDirection: "row-reverse",
          flexDirection: "row-reverse",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-tip": {
          width: 0,
          height: 0,
          border: "10px solid transparent",
          zIndex: 1,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-top .mapboxgl-popup-tip": {
          WebkitAlignSelf: "center",
          alignSelf: "center",
          borderTop: "none",
          borderBottomColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip": {
          WebkitAlignSelf: "flex-start",
          alignSelf: "flex-start",
          borderTop: "none",
          borderLeft: "none",
          borderBottomColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip": {
          WebkitAlignSelf: "flex-end",
          alignSelf: "flex-end",
          borderTop: "none",
          borderRight: "none",
          borderBottomColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip": {
          WebkitAlignSelf: "center",
          alignSelf: "center",
          borderBottom: "none",
          borderTopColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip": {
          WebkitAlignSelf: "flex-start",
          alignSelf: "flex-start",
          borderBottom: "none",
          borderLeft: "none",
          borderTopColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip": {
          WebkitAlignSelf: "flex-end",
          alignSelf: "flex-end",
          borderBottom: "none",
          borderRight: "none",
          borderTopColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-left .mapboxgl-popup-tip": {
          WebkitAlignSelf: "center",
          alignSelf: "center",
          borderLeft: "none",
          borderRightColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-right .mapboxgl-popup-tip": {
          WebkitAlignSelf: "center",
          alignSelf: "center",
          borderRight: "none",
          borderLeftColor: "#fff",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-close-button": {
          position: "absolute",
          right: 0,
          top: 0,
          border: 0,
          borderRadius: "0 3px 0 0",
          cursor: "pointer",
          backgroundColor: "transparent",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-close-button:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-content": {
          position: "relative",
          background: "#fff",
          borderRadius: "3px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          padding: "10px 10px 15px",
          pointerEvents: "auto",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-top-left .mapboxgl-popup-content": {
          borderTopLeftRadius: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-top-right .mapboxgl-popup-content": {
          borderTopRightRadius: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-content": {
          borderBottomLeftRadius: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-content": {
          borderBottomRightRadius: 0,
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-track-pointer": {
          display: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-popup-track-pointer *": {
          pointerEvents: "none",
          userSelect: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-map:hover .mapboxgl-popup-track-pointer": {
          display: "flex",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-map:active .mapboxgl-popup-track-pointer": {
          display: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-marker": {
          position: "absolute",
          top: 0,
          left: 0,
          willChange: "transform",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-user-location-dot, .mapboxgl-user-location-dot:before": {
          backgroundColor: "#1da1f2",
          width: "15px",
          height: "15px",
          borderRadius: "50%",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-user-location-dot:before": {
          content: '""',
          position: "absolute",
          WebkitAnimation: "mapboxgl-user-location-dot-pulse 2s infinite",
          MozAnimation: "mapboxgl-user-location-dot-pulse 2s infinite",
          MsAnimation: "mapboxgl-user-location-dot-pulse 2s infinite",
          animation: "mapboxgl-user-location-dot-pulse 2s infinite",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-user-location-dot:after": {
          borderRadius: "50%",
          border: "2px solid #fff",
          content: '""',
          height: "19px",
          left: "-2px",
          position: "absolute",
          top: "-2px",
          width: "19px",
          boxSizing: "border-box",
          boxShadow: "0 0 3px rgba(0, 0, 0, 0.35)",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-user-location-dot-stale": {
          backgroundColor: "#aaa",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-user-location-dot-stale:after": {
          display: "none",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-crosshair, .mapboxgl-crosshair .mapboxgl-interactive, .mapboxgl-crosshair .mapboxgl-interactive:active": {
          cursor: "crosshair",
        },
      }}
    />

    <Global
      styles={{
        ".mapboxgl-boxzoom": {
          position: "absolute",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          background: "#fff",
          border: "2px dotted #202020",
          opacity: 0.5,
        },
      }}
    />
  </>
);
