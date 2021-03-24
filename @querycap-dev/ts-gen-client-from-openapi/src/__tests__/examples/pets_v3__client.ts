import {
  createRequest,
} from "./utils"

export const addPet = createRequest<{
  body: INewPet;
}, IPet>("pets.addPet", ({
  body: pBody,
}) => {
  return {
    method: "POST",
    url: `/pets`,
    data: pBody,
    headers: {
      "Content-Type": "application/json",
    },
  };
})

export const deletePet = createRequest<{
  id: number;
}, null>("pets.deletePet", ({
  id: pID,
}) => {
  return {
    method: "DELETE",
    url: `/pets/${pID}`,
  };
})

export const findPetByID = createRequest<{
  id: number;
}, IPet>("pets.find pet by id", ({
  id: pID,
}) => {
  return {
    method: "GET",
    url: `/pets/${pID}`,
  };
})

export const findPets = createRequest<{
  tags?: Array<"z" | "b" | "c" | "a">;
  limit?: number;
}, IPet[]>("pets.findPets", ({
  tags: pTags,
  limit: pLimit,
}) => {
  return {
    method: "GET",
    url: `/pets`,
    query: {
      tags: pTags,
      limit: pLimit,
    },
  };
})

export const formMultipartWithFile = createRequest<{
  body: {
    data?: IPet;
    file: File | Blob;
    slice?: string[];
    string?: string;
  };
}, null>("pets.FormMultipartWithFile", ({
  body: pBody,
}) => {
  return {
    method: "POST",
    url: `/demo/forms/multipart`,
    data: pBody,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
})

export const formMultipartWithFiles = createRequest<{
  body: {
    files: Array<File | Blob>;
  };
}, null>("pets.FormMultipartWithFiles", ({
  body: pBody,
}) => {
  return {
    method: "POST",
    url: `/demo/forms/multipart-with-files`,
    data: pBody,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
})

export const formURLEncoded = createRequest<{
  body: IRequestForm;
}, null>("pets.FormURLEncoded", ({
  body: pBody,
}) => {
  return {
    method: "POST",
    url: `/demo/forms/url-encoded`,
    data: pBody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
})

export interface INewPet {
  name: string;
  tag?: string;
}

export interface IPet extends INewPet {
  id: number;
}

export interface IRequestForm {
  data: IPet;
  slice: string[];
  string: string;
}