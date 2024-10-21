import { FormValues } from "../component/filter/filter.component";

export const getParamFromFilterArray = (filterArray: FormValues) => {
  if (filterArray) {
    let paramObj = "";
    for (const key in filterArray) {
        if (Object.prototype.hasOwnProperty.call(filterArray, key)) {
            const element = filterArray[key];
            if (key && element) {
                paramObj += paramObj.length ? `&${key}=${element}` : `${key}=${element}`;
              }
        }
    }
    return paramObj;
  } else {
    return '';
  }
};


