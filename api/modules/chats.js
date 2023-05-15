import apiFactory from "../apiFactory";

export function getChtas(payload) {
  return apiFactory.gets(payload);
}
