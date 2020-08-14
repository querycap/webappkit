import { createRequestActor } from "../RequestActor";
import { AxiosResponse } from "axios";
import { StatusOK, StatusUnauthorized } from "@reactorx/request";
import { noop } from "lodash";

interface IGitHubError {
  message: string;
  documentation_url: string;
}

describe("request", () => {
  describe("#RequestActor", () => {
    const getApiList = createRequestActor<void, { [k: string]: string }, IGitHubError>("github", () => ({
      method: "GET",
      url: "/",
      headers: {
        "Content-Type": "application/json",
      },
    }));

    it("#href", () => {
      const actor = getApiList.with(undefined);
      expect(actor.href("https://api.github.com")).toBe("https://api.github.com/?");
    });

    it("#requestConfig", () => {
      const actor = getApiList.with(undefined);

      expect(actor.requestConfig()).toEqual({
        method: "GET",
        url: "/",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    it("#requestConfig with extra request config", () => {
      const onDownloadProgress = noop;

      const actor = getApiList.with(undefined, {
        onDownloadProgress,
      });

      expect(actor.requestConfig()).toEqual({
        method: "GET",
        url: "/",
        headers: {
          "Content-Type": "application/json",
        },
        onDownloadProgress,
      });
    });

    it("async stages", () => {
      const resp: AxiosResponse = {
        config: {},
        status: StatusOK,
        statusText: "OK",
        headers: {},
        data: {
          emojis_url: "https://api.github.com/emojis",
        },
      };

      const doneActor = getApiList.done.with(resp);

      expect(doneActor.type).toBe("@@request/github::DONE");
      expect(doneActor.arg).toEqual(resp);

      const err = {
        config: {},
        status: StatusUnauthorized,
        statusText: "Unauthorized",
        headers: {},
        data: {
          message: "Unauthorized",
          documentation_url: "",
        },
      };

      const failedActor = getApiList.failed.with(err);

      expect(failedActor.type).toBe("@@request/github::FAILED");
      expect(failedActor.arg).toEqual(err);
    });
  });
});
