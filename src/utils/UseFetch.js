import { useState, useEffect } from "react";

const inProgress = {};

export default function useFetch(...urls) {

  const [data, setData] = useState(new Array(urls.length));
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    inProgress[urls] =
      inProgress[urls] ||
      urls.map((url) =>
        fetch(url).then((response) => response.json())
      );

    (async () => {
      setData(await Promise.all(inProgress[urls]));
      setLoading(false);
      delete inProgress[urls];
    })();

  }, []);

  return [...data, loading];
}