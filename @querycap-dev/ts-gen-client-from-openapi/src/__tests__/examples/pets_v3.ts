// https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore-expanded.yaml
import { IOpenAPI } from "../../OpenAPI";

export default {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Swagger Petstore",
    description:
      "A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0 specification",
    termsOfService: "http://swagger.io/terms/",
    contact: {
      name: "Swagger API Team",
      email: "foo@example.com",
      url: "http://madskristensen.net",
    },
    license: {
      name: "MIT",
      url: "http://github.com/gruntjs/grunt/blob/master/LICENSE-MIT",
    },
  },
  servers: [
    {
      url: "http://petstore.swagger.io/api",
    },
  ],
  paths: {
    "/demo/forms/multipart": {
      post: {
        tags: ["routes"],
        summary: "Form Multipart",
        operationId: "FormMultipartWithFile",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/Pet",
                      },
                      {},
                    ],
                    "x-go-json": "data",
                    "x-go-name": "Pet",
                  },
                  file: {
                    type: "string",
                    format: "binary",
                    "x-go-json": "file",
                    "x-go-name": "File",
                    "x-pointer": 1,
                  },
                  slice: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    "x-go-json": "slice",
                    "x-go-name": "Slice",
                  },
                  string: {
                    type: "string",
                    "x-go-json": "string",
                    "x-go-name": "String",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "204": {},
        },
      },
    },
    "/demo/forms/multipart-with-files": {
      post: {
        tags: ["routes"],
        summary: "Form Multipart With Files",
        operationId: "FormMultipartWithFiles",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  files: {
                    type: "array",
                    items: {
                      type: "string",
                      format: "binary",
                      "x-pointer": 1,
                    },
                    "x-go-json": "files",
                    "x-go-name": "Files",
                  },
                },
                required: ["files"],
              },
            },
          },
        },
        responses: {
          "204": {},
        },
      },
    },
    "/demo/forms/url-encoded": {
      post: {
        tags: ["routes"],
        summary: "Form URL Encoded",
        operationId: "FormURLEncoded",
        requestBody: {
          required: true,
          content: {
            "application/x-www-form-urlencoded": {
              schema: {
                allOf: [
                  {
                    $ref: "#/components/schemas/RequestForm",
                  },
                ],
              },
            },
          },
        },
        responses: {
          "204": {},
        },
      },
    },
    "/pets": {
      get: {
        description:
          "Returns all pets from the system that the user has access to\nNam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.\n\nSed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.\n",
        operationId: "findPets",
        parameters: [
          {
            name: "tags",
            in: "query",
            description: "tags to filter by",
            required: false,
            style: "form",
            schema: {
              type: "array",
              items: {
                type: "string",
                enum: ["z", "b", "c", "a"],
              },
            },
          },
          {
            name: "limit",
            in: "query",
            description: "maximum number of results to return",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
            },
          },
        ],
        responses: {
          "200": {
            description: "pet response",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Pet",
                  },
                },
              },
            },
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        description: "Creates a new pet in the store.  Duplicates are allowed",
        operationId: "addPet",
        requestBody: {
          description: "Pet to add to the store",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewPet",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "pet response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/pets/{id}": {
      get: {
        description: "Returns a user based on a single ID, if the user does not have access to the pet",
        operationId: "find pet by id",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of pet to fetch",
            required: true,
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        responses: {
          "200": {
            description: "pet response",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        description: "deletes a single pet based on the ID supplied",
        operationId: "deletePet",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of pet to delete",
            required: true,
            schema: {
              type: "integer",
              format: "int64",
            },
          },
        ],
        responses: {
          "204": {
            description: "pet deleted",
          },
          default: {
            description: "unexpected error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      RequestForm: {
        type: "object",
        properties: {
          data: {
            allOf: [
              {
                $ref: "#/components/schemas/Pet",
              },
              {},
            ],
            "x-go-json": "data",
            "x-go-name": "Pet",
          },
          slice: {
            type: "array",
            items: {
              type: "string",
            },
            "x-go-json": "slice",
            "x-go-name": "Slice",
          },
          string: {
            type: "string",
            "x-go-json": "string",
            "x-go-name": "String",
          },
        },
        required: ["string", "slice", "data"],
      },
      Pet: {
        allOf: [
          {
            $ref: "#/components/schemas/NewPet",
          },
          {
            required: ["id"],
            properties: {
              id: {
                type: "integer",
                format: "int64",
              },
            },
          },
        ],
      },
      NewPet: {
        required: ["name"],
        properties: {
          name: {
            type: "string",
          },
          tag: {
            type: "string",
          },
        },
      },
      Error: {
        required: ["code", "message"],
        properties: {
          code: {
            type: "integer",
            format: "int32",
          },
          message: {
            type: "string",
          },
        },
      },
    },
  },
} as IOpenAPI;
