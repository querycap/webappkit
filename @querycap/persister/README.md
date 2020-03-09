# persister

根据 store state key 的前缀 `$` 决定是否要缓存 (双 `$$` 表示要多 tab 同步)。  

另外如果 store state 的值是 `object` 且有 `expireAt`(RFC3339) 字段，将判断是否过期。过期则不读。