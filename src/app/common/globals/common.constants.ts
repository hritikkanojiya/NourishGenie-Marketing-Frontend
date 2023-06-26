import { Location } from "react-router-dom";
import { GetResponseOptions, MetaData } from "./common.model";

export const APP_NAME = `${process.env.REACT_APP_NAME}`;

export const GENIE_MARKETING_API = `${process.env.REACT_APP_GENIE_MARKETING_API}`;

export const GENIE_MARKETING_SOCKET = `${process.env.REACT_APP_SOCKET_URL}`;

export const GENIE_MARKETING_API_VERSION = `${process.env.REACT_APP_GENIE_MARKETING_VERSION}`;

export const ACCESS_TOKEN_HEADER = `${process.env.REACT_APP_JWT_ACCESS_TOKEN_HEADER}`;

export const SOCKET_TOKEN_HEADER = `${process.env.REACT_APP_SOCKET_TOKEN_HEADER}`;

export const ACCESS_TOKEN_NAME = `${process.env.REACT_APP_ACCESS_TOKEN_NAME_LOCALSTORAGE}`;

export const AGENT = `${process.env.REACT_APP_AGENT_DETAILS_LOCALSTORAGE}`;

export const IST_DATE_FORMAT = `${process.env.REACT_APP_IST_DATE_FORMAT}`;

export const LAYOUT_KEY = `${process.env.REACT_APP_BASE_LAYOUT_CONFIG_KEY}`;

export const SUPPORT_EMAIL = `${process.env.REACT_APP_SUPPORT_EMAIL}`;

export const ITEMS_PER_PAGE = 10;

export const SHOWING_FROM = 1;

export const SHOWING_TILL = 10;

export const CURRENT_PAGE = 1;

export const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export type sortObj = { sortOn: string | null; sortBy: "asc" | "desc" | null };

export const methodOptions = methods.map((method) => {
  return { value: method, label: method };
});

export const onChangeSortObj = (event: any, sortObj: sortObj) => {
  const id = event?.target?.id;
  if (!sortObj?.sortBy) sortObj = { sortOn: id, sortBy: "asc" };
  else {
    if (sortObj.sortOn === id && sortObj.sortBy === "asc")
      sortObj.sortBy = "desc";
    else if (sortObj.sortOn === id && sortObj.sortBy === "desc")
      sortObj = { sortOn: "_id", sortBy: "asc" };
    else sortObj = { sortOn: id, sortBy: "asc" };
  }
  return sortObj;
};

export const getRequestMethodColor = (method: String) => {
  switch (method) {
    case "POST":
      return "warning";
    case "GET":
      return "success";
    case "PUT":
      return "info";
    case "DELETE":
      return "danger";
    case "PATCH":
      return "primary";
    default:
      return "primary";
  }
};

export const getStatusCodeColor = (statusCode?: number) => {
  if (!statusCode) return "primary";

  if (statusCode >= 200 && statusCode <= 300) {
    return "success";
  } else if (statusCode >= 300 && statusCode <= 400) {
    return "info";
  } else if (statusCode >= 400 && statusCode <= 500) {
    return "warning";
  } else if (statusCode >= 500 && statusCode <= 600) {
    return "danger";
  } else {
    return "primary";
  }
};

export const getEventColor = (eventStatus: String) => {
  switch (eventStatus) {
    case "running":
      return "warning";
    case "completed":
      return "success";
    case "started":
      return "info";
    case "suspended":
      return "danger";
    default:
      return "primary";
  }
};

export const getUrlParamString = (
  filterOptions: GetResponseOptions
): string => {
  const params = new URLSearchParams();
  Object.entries(filterOptions).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value === "true") value = true;
      if (value === "false") value = false;

      if (typeof value === "object") value = JSON.stringify(value);
      params.append(key, value.toString());
    }
  });
  return params.toString();
};

export const getUrlParamObject = (queryString: string): URLSearchParams => {
  const params = new URLSearchParams(queryString);
  return params;
};

export const parseParamValueFromObjectString = (
  queryString: string,
  obj: string,
  key: string
): any => {
  const params = new URLSearchParams(queryString);
  return JSON.parse(params.get(obj) || "{}")?.[key];
};

export const getMetaDataValues = (
  location: Location,
  metaData: MetaData
): MetaData => {
  return {
    limit:
      metaData.limit ||
      parseParamValueFromObjectString(location.search, "metaData", "limit"),
    offset:
      metaData.offset ||
      parseParamValueFromObjectString(location.search, "metaData", "offset"),
    sortBy:
      metaData.sortBy ||
      parseParamValueFromObjectString(location.search, "metaData", "sortBy"),
    sortOn:
      metaData.sortOn ||
      parseParamValueFromObjectString(location.search, "metaData", "sortOn"),
  };
};

export const findSubstringIndices = (str: string, substring: string) => {
  const indices = [];
  let startIndex = 0;

  while (startIndex < str.length) {
    const index = str.indexOf(substring, startIndex);
    if (index === -1) break;

    const endIndex = index + substring.length - 1;
    indices.push({ start: index, end: endIndex });

    startIndex = endIndex + 1;
  }

  return indices;
};
