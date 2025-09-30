import { types } from "../types/types";

export const authReducer = (state = {}, action) => {
  switch (action.type) {
    case types.login:
      return {
        ...state,
        logged: true,
        token: action.payload.token,
        user: action.payload.user ?? null,
      };
    case types.logout:
      return { logged: false, token: null, user: null };
    default:
      return state;
  }
};
