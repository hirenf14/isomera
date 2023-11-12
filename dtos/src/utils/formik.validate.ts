import { transformAndValidateSync } from 'class-transformer-validator'
import { ValidationError } from 'class-validator'

import { getEnumKeyByEnumValue } from './getEnumKeyByEnumValue'
import { pascalToSnakeCase } from './pascalToSnakeCase'
import { ValidationMessageEnums } from '../validation/validationMessage.enums'

export type Ret = { [key: string]: string | Ret }
export type Class = { new (...args: any[]): any }

export const formikValidate = (model: Class, data: any) => {
  try {
    transformAndValidateSync(model, data)

    return {}
  } catch (e: any) {
    return convertError(e)
  }
}

const convertError = (errors: ValidationError[]) => {
  const result: Ret = {}

  for (const error of Array.from(errors)) {
    if (error?.children && error.children.length > 0) {
      result[error.property] = convertError(error.children)
    } else {
      const value = Object.values(error.constraints!)[0]
      const enumKey = getEnumKeyByEnumValue(ValidationMessageEnums, value)

      if (!enumKey) {
        console.error({ [error.property]: value })
        result[error.property] = value
      } else {
        result[error.property] = pascalToSnakeCase(enumKey)
      }
    }
  }
  return result
}