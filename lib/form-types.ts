export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: Record<string, string>;
};

export const initialActionState: ActionState = {
  status: "idle",
  message: "",
  errors: {},
};

export type SimpleActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialSimpleState: SimpleActionState = {
  status: "idle",
  message: "",
};
