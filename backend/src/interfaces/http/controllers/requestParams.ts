import { Request } from "express";

export const getParamAsString = (req: Request, name: string): string => {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] : value;
};

export const getParamAsNumber = (req: Request, name: string): number => {
  return Number.parseInt(getParamAsString(req, name), 10);
};
