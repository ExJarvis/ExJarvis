import * as React from "react";
import { message } from "antd";
import { APIResponseType } from "src/Library/Types";

export type ApiStatus = "READY" | "RUNNING" | "FINISHED" | "FAILED" | "CANCELLED";
export type API<A, T> = (params?: A) => Promise<APIResponseType<T>>;

const useApi = <T, A>(
  defaultApi: API<A,T>,
  defaultDelay: Number = 0,
  defaultShouldDisplayError: boolean = false,
) => {
  const [api, setApi] = React.useState(() => defaultApi);
  const [status, setStatus] = React.useState("READY" as ApiStatus);
  const [data, setData] = React.useState(undefined as T | undefined);
  const [errorMessage, setErrorMessage] = React.useState(null as any);
  const [delayedCallExecutor, setDelayedCallExecutor] = React.useState(
    null as any
  );

  const flushStates = () => {
    setData(undefined);
    setErrorMessage(null);
  };

  /** Synchronously call the api */
  const callApiWithoutDelay = async (
    params?: A,
    shouldDisplayError?: boolean,
  ) => {
    flushStates();
    /** Call api */
    if (!api) throw new Error("Bad API input");
    const response = api
      ? await api(params)
      : {
          isSuccess: false,
          errorMessage: `Bad API function provided to 'useApi()'`,
        };
    /** Handle response */
    if (response.isSuccess) {
      // Api was successful
      setData(response.data);
      setStatus("FINISHED");
    } else {
      // Api FAILED
      setErrorMessage(response.errorMessage);
      shouldDisplayError && message.error(response.errorMessage);
      setStatus("FAILED");
    }
  };

  /**
   * Immediate execution if `delay` is 0.
   * Calling this function before the previous started,
   * ensures previous is never called.
   * @param params api params
   * @param delay delay before executing the call
   */
  const callApiWithDelay = async (
    params?: A,
    delay: Number = defaultDelay,
    shouldDisplayError: boolean = defaultShouldDisplayError,
  ) => {
    /** Set state to 'RUNNING' */
    setStatus("RUNNING");
    /** Unschedule the previous call */
    delayedCallExecutor && clearTimeout(delayedCallExecutor);
    /** Schedule the current call */
    setDelayedCallExecutor(
      setTimeout(
        () => callApiWithoutDelay(params, shouldDisplayError),
        delay as any
      )
    );
  };

  const setApiHandler = (api) => {
    setApi(() => api);
  };

  /**
   * Cancel the on-going (if any) api call
   */
  const cancel = () => {
    /** Set state to 'CANCELLED' */
    setStatus("CANCELLED");
    /** Unschedule the previous call */
    delayedCallExecutor && clearTimeout(delayedCallExecutor);
  };

  return {
    model: {
      api,
      status, // State of the api
      data, // Response data in case of success
      errorMessage, // Error message in case of failure
    },
    call: callApiWithDelay, // Api call scheduler
    setApi: setApiHandler,
    cancel,
  };
};

export default useApi;
