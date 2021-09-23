export enum SimpleTypes {
  "boolean" = "boolean",
  integer = "integer",
  array = "array",
  "null" = "null",
  number = "number",
  object = "object",
  string = "string",
}

export interface IApplicator {
  additionalItems?: TSchema;
  unevaluatedItems?: TSchema;
  items?: TSchema | TSchemaArray;
  contains?: TSchema;
  additionalProperties?: TSchema;
  unevaluatedProperties?: {
    [k: string]: TSchema;
  };
  properties?: {
    [k: string]: TSchema;
  };
  patternProperties?: {
    [k: string]: TSchema;
  };
  dependentSchemas?: {
    [k: string]: TSchema;
  };
  propertyNames?: TSchema;
  if?: TSchema;
  then?: TSchema;
  else?: TSchema;
  allOf?: TSchemaArray;
  anyOf?: TSchemaArray;
  oneOf?: TSchemaArray;
  not?: TSchema;
}

export interface IContent {
  contentMediaType?: string;
  contentEncoding?: string;
  contentSchema?: TSchema;
}

export interface ICore {
  $id?: string;
  $schema?: string;
  $anchor?: string;
  $ref?: string;
  $recursiveRef?: string;
  $recursiveAnchor?: true;
  $vocabulary?: {
    [k: string]: boolean;
  };
  $comment?: string;
  $defs?: {
    [k: string]: TSchema;
  };
}

export interface IFormat {
  format?: string;
}

export interface IMetaData {
  title?: string;
  description?: string;
  default?: any;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: any[];
}

export interface ISchemaBasic extends ICore, IApplicator, IValidation, IMetaData, IFormat, IContent {}

export interface IValidation {
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: TNonNegativeInteger;
  minLength?: TNonNegativeIntegerDefault0;
  pattern?: string;
  maxItems?: TNonNegativeInteger;
  minItems?: TNonNegativeIntegerDefault0;
  uniqueItems?: boolean;
  maxContains?: TNonNegativeInteger;
  minContains?: TNonNegativeInteger;
  maxProperties?: TNonNegativeInteger;
  minProperties?: TNonNegativeIntegerDefault0;
  required?: TStringArray;
  dependentRequired?: {
    [k: string]: TStringArray;
  };
  const?: any;
  enum?: any[];
  type?: TSimpleTypes | TSimpleTypes[];
}

export type TNonNegativeInteger = number;

export type TNonNegativeIntegerDefault0 = TNonNegativeInteger;

export type TSchema = ISchemaBasic | boolean;

export type TSchemaArray = TSchema[];

export type TSimpleTypes = keyof typeof SimpleTypes;

export type TStringArray = string[];
