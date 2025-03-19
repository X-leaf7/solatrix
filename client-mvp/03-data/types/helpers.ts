export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONArray
  | JSONObject;

interface JSONObject {
  [key: string]: JSONValue;
}

type JSONArray = Array<JSONValue>;

export type Token = string | null | undefined;