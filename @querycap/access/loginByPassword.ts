const MAX_ENCRYPT_BLOCK = 117 - 31;
const RSA_PKCS1_PADDING = 1;

export const createEncrypt = (publicKey: string) => {
  return (data: string) => {
    // @ts-ignore
    return import("public-encrypt").then(({ publicEncrypt }) => {
      const buf = new Buffer(data, "utf-8");
      const inputLen = buf.byteLength;
      const bufs = [];

      let offSet = 0;
      let endOffSet = MAX_ENCRYPT_BLOCK;

      while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
          const bufTmp = buf.slice(offSet, endOffSet);
          bufs.push(publicEncrypt({ key: publicKey, padding: RSA_PKCS1_PADDING }, bufTmp));
        } else {
          const bufTmp = buf.slice(offSet, inputLen);
          bufs.push(publicEncrypt({ key: publicKey, padding: RSA_PKCS1_PADDING }, bufTmp));
        }
        offSet += MAX_ENCRYPT_BLOCK;
        endOffSet += MAX_ENCRYPT_BLOCK;
      }

      const result = Buffer.concat(bufs);
      return result.toString("base64");
    });
  };
};
