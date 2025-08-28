import { useReducer, useEffect, useState } from "react";
import axios from "axios";

const ACTIONS = {
  API_REQUEST: "api-request",
  FETCH_DATA: "fetch-data",
  ERROR: "error",
};

const initialState = {
  data: [],
  loading: false,
  error: null,
};

function reducer(state, { type, payload }) {
  console.log(payload);
  switch (type) {
    case ACTIONS.API_REQUEST:
      return { ...state, data: [], loading: true };
    case ACTIONS.FETCH_DATA:
      return { ...state, data: payload, loading: false };
    case ACTIONS.ERROR:
      return { ...state, data: [], error: payload };
    default:
      return state;
  }
}

function useFetch(url) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ACTIONS.API_REQUEST });
        const res = await axios.get(url);
        dispatch({ type: ACTIONS.FETCH_DATA, payload: res.data });
      } catch (error) {
        dispatch({ type: ACTIONS.ERROR, payload: error.message });
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
