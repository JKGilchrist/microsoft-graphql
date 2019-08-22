import {
  ComplexField
} from "./parseFields";

enum TypesEnum {
  USER,
  GROUP,
  ERROR
}

function typeResolver(currentType : TypesEnum, complexField : ComplexField) {
  if (currentType == TypesEnum.GROUP) {
    if (complexField.value === "members") {
      return TypesEnum.USER;
    } 
  }
  else if (currentType == TypesEnum.USER) {
    if (complexField.value === "groups") {
      return TypesEnum.GROUP;
    }
  }
  return TypesEnum.ERROR;
}

export {
  TypesEnum,
  typeResolver
};