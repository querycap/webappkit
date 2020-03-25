import { ThemeProvider } from "@querycap-ui/core";
import { createBootstrap } from "@querycap/bootstrap";
import { Route, Switch } from "@reactorx/router";
import React from "react";
import { ComponentDocs } from "./ComponentDocs";

export const bootstrap = createBootstrap("sg")(
  <>
    <ThemeProvider>
      <Switch>
        <Route path="/" component={ComponentDocs} exact />
        <Route path="/:group" component={ComponentDocs} exact />
        <Route path="/:group/:module" component={ComponentDocs} exact />
        <Route path="/:group/:module/:name" component={ComponentDocs} exact />
      </Switch>
    </ThemeProvider>
  </>,
);
