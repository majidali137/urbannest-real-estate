import { useReducer, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

// ---- Action constants ----
const ACTIONS = {
  API_REQUEST: "api-request",
  FETCH_DATA: "fetch-data",
  ERROR: "error",
} as const;

// ---- Types ----
interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type Action<T> =
  | { type: typeof ACTIONS.API_REQUEST }
  | { type: typeof ACTIONS.FETCH_DATA; payload: T }
  | { type: typeof ACTIONS.ERROR; payload: string };

// ---- Reducer ----
function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case ACTIONS.API_REQUEST:
      return { ...state, data: null, loading: true, error: null };
    case ACTIONS.FETCH_DATA:
      return { ...state, data: action.payload, loading: false };
    case ACTIONS.ERROR:
      return { ...state, data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

// ---- Hook ----
function useFetch<T = unknown>(url: string) {
  const initialState: State<T> = {
    data: null,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(reducer<T>, initialState);
  const [timestamp, setTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ACTIONS.API_REQUEST });
        const res = await axios.get<T>(url);
        dispatch({ type: ACTIONS.FETCH_DATA, payload: res.data });
      } catch (error) {
        const err = error as AxiosError;
        dispatch({
          type: ACTIONS.ERROR,
          payload: err.message || "Unknown error",
        });
      }
    };

    fetchData();
  }, [url, timestamp]);

  const forceFetch = () => {
    setTimestamp(Date.now());
  };

  return { ...state, forceFetch };
}

export default useFetch;
