// 中划线转驼峰
const camelize = (str: string) => {
  return (str + '').replace(/-\D/g, function (match) {
    return match.charAt(1).toUpperCase();
  });
};

/**
 * 自动串行异步操作
 * @param ps promise数组
 * @param callback 全部执行完毕的回调
 */
function runGen(ps: Promise<any>[], callback = () => {}) {
  function* gent() {
    let i = 0;
    for (i = 0; i < ps.length; i += 1) {
      console.log('ps', i, ps);
      yield ps[i];
    }
  }
  const g = gent();
  function next(data: any) {
    const res = g.next(data);
    if (res.done) {
      callback();
      return res.value;
    }

    res.value.then((data: any) => {
      console.log('res.value', res, new Date());
      next(data);
    });
  }
  // @ts-ignore
  next();
}

const handleFileSize = (size: number) => {
  if (size < 1024) return size + 'b';
  if (size < 1024 * 1024) return Math.round(size / 1024) + 'Kb';
  return Math.round(size / (1024 * 1024)) + 'Mb';
};


// 序列化地址
const paramsStringfy = (url: string, params = {}) => {
  let res = url;
  let s = '';
  Object.entries(params).forEach(([k, v]) => {
    s += `${k}=${Array.isArray(v) ? v.toString() : v}&`;
  });
  res += '?' + s.slice(0, -1);
  return res;
};

// 解析路径参数
const parseUrlSearch: (a: string, b?: any) => any = (
  search: string,
  extras: any = {}
) => {
  const obj = { ...extras };
  if (!search.includes('?')) {
    return obj;
  }
  let pString = search.slice(1);
  let childUrlSuffix = '';
  if (!pString.length) {
    return obj;
  }
  if (pString.includes('?') && pString.includes('http')) {
    // 除了第一个?还有?和http说明里面带有参数的地址信息
    const [a, childParams] = pString.split('?');
    pString = a;
    childUrlSuffix = childParams;
  }
  const pObjStringArr = pString.split('&');
  if (!pObjStringArr.length) {
    return obj;
  }
  pObjStringArr.forEach((o) => {
    const [k, v] = o.split('=');
    obj[k] = v;
  });
  // 查看是否有子路由路径，包含http的，有则把后缀加到上面
  if (childUrlSuffix) {
    Object.entries(obj).forEach(([k, v]) => {
      if (v && (v as string).includes('http')) {
        obj[k] = v + '?' + childUrlSuffix;
      }
    });
  }
  return obj;
};

const debounce = (callback = (a?: any) => {}, time = 100) => {
  let timer: any = null;
  return (...params: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...params);
    }, time);
  };
};

export const TYPE_UNDEFINED = 'undefined';
export const TYPE_NULL = 'null';

/**
 * 获取类型
 * @param {*} v
 * @returns {string}
 */
export const getTypeOf = (v: any) =>
  v === undefined
    ? TYPE_UNDEFINED
    : v === null
    ? TYPE_NULL
    : v.constructor.name.toLowerCase();

/**
 * 判断类型
 * @param {*} v
 * @returns {Boolean}
 */
export const isTypeOf = (v: any, t: any) => getTypeOf(v) === t;
export const isString = (v: any) => isTypeOf(v, 'string');
export const isNumber = (v: any) => isTypeOf(v, 'number');
export const isObject = (v: any) => isTypeOf(v, 'object');
export const isArray = (v: any) => isTypeOf(v, 'array');
export const isFunction = (v: any) => isTypeOf(v, 'function');
export const isUndefined = (v: any) => isTypeOf(v, TYPE_UNDEFINED);
export const isNull = (v: any) => isTypeOf(v, TYPE_NULL);
export const isDate = (v: any) => isTypeOf(v, 'date');
export const isRegex = (v: any) => isTypeOf(v, 'regexp');
export const isBoolean = (v: any) => isTypeOf(v, 'boolean');
export const isSingleNumber = (v: any) => /^\d+$/.test(v);
export const isNil = (v: any) => isUndefined(v) || isNull(v);

/**
 * 判断对象 or 数组是否为空
 * @param o
 * @returns {boolean}
 */
const isEmpty = (o: any) => {
  if (isNil(o) || (isString(o) && o === '')) {
    return true;
  } else if (isArray(o)) {
    return o.length === 0;
  } else if (isObject(o)) {
    return Object.keys(o).length === 0;
  } else {
    return false;
  }
};

// 数组object去重
const removeDuplicate = (arr: object[], key: string) => {
  const map: any = {};
  const res: any = [];
  arr.forEach((i: any) => {
    if (!map[i[key]]) {
      res.push(i);
      map[i[key]] = 1;
    }
  });
  return res;
};

// base64转file
function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  if (arr[0]) {
    const reg = /:(.*?);/;
    const regString = arr[0].match(reg);
    if (regString) {
      const mime = regString[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename?.split('.')[0], { type: mime });
    }
  }
}

// 将对象中的数值字符串变为数值类型
const numbericalObjectValues = (obj: any) => {
  if (!isObject(obj)) {
    return obj;
  }
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    const current = obj[key];
    if (!isNaN(current)) {
      obj[key] = Number(current);
    }
  });
  return obj;
};





export {
  camelize,
  runGen,
  handleFileSize,
  numbericalObjectValues,
  paramsStringfy,
  debounce,
  isEmpty,
  parseUrlSearch,
  removeDuplicate,
  dataURLtoFile,

};
